import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    if (!to) {
      console.error("❌ Email sending failed: Recipient email missing");
      return;
    }

    await resend.emails.send({
      from: "Event Management <onboarding@resend.dev>", // works for testing
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully via Resend");
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};
