import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { email, firstName, frequency } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; background-color: #FFC904; padding: 40px 20px; text-align: center;">
        <div style="background-color: white; border: 6px solid black; border-radius: 24px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 8px 8px 0px 0px black;">
          <div style="font-size: 48px; margin-bottom: 16px;">⚔️</div>
          <h1 style="color: black; font-size: 32px; margin-top: 0;">Welcome to FirstStep, ${firstName}!</h1>
          <p style="font-size: 18px; color: #333; font-weight: bold; line-height: 1.5;">
            You are officially on the list. 
          </p>
          <p style="font-size: 16px; color: #555; line-height: 1.5;">
            Your preferences have been saved. Our web scrapers are out hunting right now, and you will start receiving your ${frequency.toLowerCase()} internship drops shortly.
          </p>
          <hr style="border: 2px solid black; margin: 30px 0;" />
          <p style="margin-top: 30px; font-size: 14px; color: #777;">Charge On! - The FirstStep Team</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: "FirstStep <hello@firststep.services>",
      to: email,
      subject: "Welcome to FirstStep! 🚀",
      html: emailHTML,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Welcome Email Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send welcome email" },
      { status: 500 },
    );
  }
}
