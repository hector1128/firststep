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

    // Loop through each industry to keep the searches clean
    for (const currentQuery of queries) {
      const apifyUrl = `https://api.apify.com/v2/acts/johnvc~google-jobs-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

      const apifyResponse = await fetch(apifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: currentQuery,
          location: "United States",
          maxPagesPerQuery: 1,
        }),
      });

      if (!apifyResponse.ok) {
        const errorDetails = await apifyResponse.text();
        console.error(`Apify Error for ${currentQuery}:`, errorDetails);
        continue; // If one query fails, skip it and try the next one!
      }

      const scrapedJobs = await apifyResponse.json();

      // Format the data and dig out the direct ATS link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedJobs = scrapedJobs.map((job: any) => {
        let industry = "Public Sector & Humanities";
        if (
          job.title.toLowerCase().includes("software") ||
          job.title.toLowerCase().includes("tech")
        ) {
          industry = "Technology & Engineering";
        } else if (
          job.title.toLowerCase().includes("marketing") ||
          job.title.toLowerCase().includes("business")
        ) {
          industry = "Business & Operations";
        }

        // Dig into the apply_options array for the direct link, fallback to share_link if it fails
        const directLink =
          job.apply_options && job.apply_options.length > 0
            ? job.apply_options[0].link
            : job.job_link || job.share_link;

        return {
          title: job.title,
          company: job.company_name,
          location: job.location,
          url: directLink,
          role: "Internship",
          industry: industry,
        };
      });

      allFormattedJobs = [...allFormattedJobs, ...formattedJobs];
    }

    // Upsert everything into Supabase
    const { error } = await supabase
      .from("jobs")
      .upsert(allFormattedJobs, { onConflict: "url", ignoreDuplicates: true });

    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${allFormattedJobs.length} jobs.`,
    });
  } catch (error) {
    console.error("Scraping Error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
