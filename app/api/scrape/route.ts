import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const APIFY_TOKEN = process.env.APIFY_API_TOKEN!;

export async function GET(request: Request) {
  try {
    console.log("Starting Apify Scrape...");

    // 1. Tell Apify to run the scraper and wait for the results
    // We use "johnvc~google-jobs-scraper" based on your screenshot
    const apifyUrl = `https://api.apify.com/v2/acts/johnvc~google-jobs-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
    
    const apifyResponse = await fetch(apifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // CHANGED: "queries" is now "query"
        query: "Marketing Internship\nSoftware Engineer Internship", 
        location: "United States",
        maxPagesPerQuery: 1, 
      }),
    });

    if (!apifyResponse.ok) {
      // Catch the exact error message from Apify
      const errorDetails = await apifyResponse.text();
      console.error("Apify API Error Status:", apifyResponse.status);
      console.error("Apify API Error Details:", errorDetails);
      throw new Error(`Apify rejected the request: ${apifyResponse.status}`);
    }

    const scrapedJobs = await apifyResponse.json();
    console.log(`Successfully scraped ${scrapedJobs.length} jobs.`);

    // 2. Format the data to match our Supabase schema
    const formattedJobs = scrapedJobs.map((job: any) => {
      
      // Basic logic to assign the correct industry based on the job title
      let industry = "Public Sector & Humanities"; // Default fallback
      if (job.title.toLowerCase().includes("software") || job.title.toLowerCase().includes("tech")) {
        industry = "Technology & Engineering";
      } else if (job.title.toLowerCase().includes("marketing") || job.title.toLowerCase().includes("business")) {
        industry = "Business & Operations";
      }

      return {
        title: job.title,
        company: job.company_name,
        location: job.location,
        url: job.job_url || job.apply_link || job.share_link, // Depends on the exact JSON output
        role: "Internship", 
        industry: industry,
      };
    });

    // 3. Upsert into Supabase (Ignores duplicates automatically!)
    const { data, error } = await supabase
      .from("jobs")
      .upsert(formattedJobs, { onConflict: "url", ignoreDuplicates: true });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed ${formattedJobs.length} jobs.` 
    });

  } catch (error) {
    console.error("Scraping Error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}