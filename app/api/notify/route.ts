import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Initialize Supabase and Resend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(request: Request) {
  // Protect the route from public access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    console.log("Starting Notification Engine...");
    const now = new Date();

    // 1. Fetch all ACTIVE users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .eq("is_active", true);

    if (usersError) throw new Error(usersError.message);

    // 2. Fetch jobs from the last 8 days (covers weekly users with a 1-day buffer)
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(now.getDate() - 8);

    const { data: recentJobs, error: jobsError } = await supabase
      .from("jobs")
      .select("*")
      .gte("created_at", eightDaysAgo.toISOString());

    if (jobsError) throw new Error(jobsError.message);

    const updatedUsers = [];
    let emailsSentCount = 0;

    // 3. The Matching Loop
    for (const user of users || []) {
      const lastEmailed = new Date(user.last_emailed_at);
      const hoursSinceLastEmail =
        (now.getTime() - lastEmailed.getTime()) / (1000 * 60 * 60);

      // Check if it's time to email them (23 hours for Daily, 167 hours for Weekly)
      const isDueForEmail =
        (user.frequency === "Daily" && hoursSinceLastEmail >= 23) ||
        (user.frequency === "Weekly" && hoursSinceLastEmail >= 167);

      if (!isDueForEmail) continue; // Skip to the next user if it's not time yet

      // Find jobs that match their industry/role AND were added after their last email
      const matchedJobs = recentJobs?.filter(
        (job) =>
          job.industry === user.industry &&
          job.role === user.role &&
          new Date(job.created_at) > lastEmailed,
      );

      // Only send an email if there are actually new jobs for them!
      if (matchedJobs && matchedJobs.length > 0) {
        // Generate the chunky, UCF-themed HTML Email
        const jobListHTML = matchedJobs
          .map(
            (job) => `
          <div style="text-align: left; margin-bottom: 20px; padding: 20px; border: 4px solid black; border-radius: 12px; background-color: #ffffff; box-shadow: 4px 4px 0px 0px #000000;">
            <h2 style="margin: 0 0 8px 0; font-size: 22px; color: black;">${job.title}</h2>
            <p style="margin: 0 0 16px 0; font-size: 16px; color: #555;"><b>${job.company}</b> • ${job.location || "United States"}</p>
            <a href="${job.url}" style="background-color: #FFC904; color: black; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; border: 3px solid black; display: inline-block;">View Role</a>
          </div>
        `,
          )
          .join("");

        const emailHTML = `
          <div style="font-family: Arial, sans-serif; background-color: #FFC904; padding: 40px 20px; text-align: center;">
            <div style="background-color: white; border: 6px solid black; border-radius: 24px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 8px 8px 0px 0px black;">
              <h1 style="color: black; font-size: 32px; margin-top: 0;">Hey ${user.first_name}! 🚀</h1>
              <p style="font-size: 18px; color: #333; font-weight: bold;">Here are your fresh <b>${user.industry}</b> ${user.role.toLowerCase()}s!</p>
              <hr style="border: 2px solid black; margin: 30px 0;" />
              ${jobListHTML}
              <div style="margin-top: 40px; text-align: center;">
  <p style="font-size: 14px; color: #555; font-weight: bold; margin-bottom: 8px;">Good luck on the grind! - The FirstStep Team</p>
  <p style="font-size: 12px; color: #999; margin: 0;">
    No longer looking for roles? 
    <a href="https://firststep.services/api/unsubscribe?email=${user.email}" style="color: #999; text-decoration: underline;">Unsubscribe instantly</a>.
  </p>
</div>
            </div>
          </div>
        `;

        // IMPORTANT: While on Resend's free tier, you MUST use 'onboarding@resend.dev' as the from address,
        // and you can ONLY send emails to the email address you used to sign up for Resend.
        await resend.emails.send({
          from: "FirstStep <team@firststep.services>",
          to: user.email,
          subject: `Your ${user.frequency} ${user.industry} Drop is here! 🎯`,
          html: emailHTML,
        });

        emailsSentCount++;

        // Queue the user to have their timestamp updated so they don't get these jobs again
        updatedUsers.push({
          ...user,
          last_emailed_at: now.toISOString(),
        });
      }
    }

    // 4. Update the database timestamps for everyone we emailed
    if (updatedUsers.length > 0) {
      const { error: updateError } = await supabase
        .from("users")
        .upsert(updatedUsers);
      if (updateError) throw new Error(updateError.message);
    }

    return NextResponse.json({
      success: true,
      message: `Engine ran successfully. Sent ${emailsSentCount} emails.`,
    });
  } catch (error) {
    console.error("Notify Engine Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run notification engine" },
      { status: 500 },
    );
  }
}
