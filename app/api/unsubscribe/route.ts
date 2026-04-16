import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    // 1. Extract the email from the URL (e.g., ?email=test@ucf.edu)
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response("Error: No email provided.", { status: 400 });
    }

    // 2. Update the user in Supabase to inactive
    const { error } = await supabase
      .from("users")
      .update({ is_active: false })
      .eq("email", email);

    if (error) {
      console.error("Supabase Unsubscribe Error:", error.message);
      return new Response("Database error. Please contact support.", {
        status: 500,
      });
    }

    // 3. Return a styled success page instantly
    const successHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Unsubscribed | FirstStep</title>
      </head>
      <body style="margin: 0; padding: 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #FFC904; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="background-color: white; border: 8px solid black; border-radius: 2rem; padding: 40px 20px; max-width: 500px; width: 100%; text-align: center; box-shadow: 12px 12px 0px 0px #000000;">
              <div style="font-size: 64px; margin-bottom: 20px;">✌️</div>
              <h1 style="color: black; font-size: 32px; font-weight: 900; margin: 0 0 16px 0; letter-spacing: -1px;">You're Unsubscribed</h1>
              <p style="color: #4b5563; font-size: 18px; font-weight: 600; margin: 0; line-height: 1.5;">
                  We've successfully removed <b>${email}</b> from our active list. You will no longer receive internship alerts from FirstStep.
              </p>
              <p style="color: #9ca3af; font-size: 14px; font-weight: 600; margin-top: 32px;">
                  Good luck with your career journey!
              </p>
          </div>
      </body>
      </html>
    `;

    return new Response(successHTML, {
      headers: { "Content-Type": "text/html" },
      status: 200,
    });
  } catch (error) {
    console.error("Unsubscribe Route Error:", error);
    return new Response("An unexpected error occurred.", { status: 500 });
  }
}
