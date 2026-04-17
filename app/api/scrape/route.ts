import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const APIFY_TOKEN = process.env.APIFY_API_TOKEN!;

export async function GET(request: Request) {
  // Protect the route from public access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.log("Starting Apify Scrape with Indeed Actor...");

    // We kept your same queries, but notice how they include the word "Internship"
    const queries = [
      "Software Engineer Internship",
      "Data Science Internship",
      "Marketing Internship",
      "Finance Internship",
      "Graphic Design Internship",
      "Human Resources Internship",
      "Public Policy Internship",
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allFormattedJobs: any[] = [];

    for (const currentQuery of queries) {
      // 1. CHANGED THE ACTOR URL: Pointing to "valig/indeed-jobs-scraper"
      const apifyUrl = `https://api.apify.com/v2/acts/valig~indeed-jobs-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

      const apifyResponse = await fetch(apifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: currentQuery, // We pass your search query here!
          country: "us",
          limit: 30, // Lower limit per query saves Apify credits and keeps data fresh
          sort: "date", // Force Indeed to give us the newest jobs
        }),
      });

      if (!apifyResponse.ok) {
        const errorDetails = await apifyResponse.text();
        console.error(`Apify Error for ${currentQuery}:`, errorDetails);
        continue;
      }

      const scrapedJobs = await apifyResponse.json();

      // 2. UPDATED THE MAPPING: Indeed uses different property names than Google Search!
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedJobs = scrapedJobs.map((job: any) => {
        let industry = "Public Sector & Humanities";

        // Slightly improved industry matching logic
        const lowercaseTitle = job.positionName?.toLowerCase() || "";
        if (
          lowercaseTitle.includes("software") ||
          lowercaseTitle.includes("tech") ||
          lowercaseTitle.includes("data")
        ) {
          industry = "Technology & Engineering";
        } else if (
          lowercaseTitle.includes("marketing") ||
          lowercaseTitle.includes("finance") ||
          lowercaseTitle.includes("human resources")
        ) {
          industry = "Business & Operations";
        } else if (lowercaseTitle.includes("design")) {
          industry = "Design & Media";
        } else if (
          lowercaseTitle.includes("health") ||
          lowercaseTitle.includes("science")
        ) {
          industry = "Sciences & Healthcare";
        }

        return {
          title: job.positionName, // Indeed calls it 'positionName'
          company: job.company, // Indeed calls it 'company'
          location: job.location, // Indeed calls it 'location'
          url: job.url, // Indeed calls it 'url'
          role: "Internship", // Hardcoded since we only searched for internships
          industry: industry,
        };
      });

      // 3. FILTER OUT JUNK: Only add jobs that actually have a title and a link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validJobs = formattedJobs.filter(
        (job: any) => job.title && job.url,
      );
      allFormattedJobs = [...allFormattedJobs, ...validJobs];
    }

    // Upsert everything into Supabase
    const { error } = await supabase
      .from("jobs")
      .upsert(allFormattedJobs, { onConflict: "url", ignoreDuplicates: true });

    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${allFormattedJobs.length} Indeed jobs.`,
    });
  } catch (error) {
    console.error("Scraping Error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
