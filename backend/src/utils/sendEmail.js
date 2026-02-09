import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    if (!to) {
      console.error("❌ Email sending failed: Recipient missing");
      return;
    }

    const msg = {
      to,
      from: `${process.env.EMAIL_USER}`, 
      subject,
      html,
    };

    await sgMail.send(msg);

    console.log("✅ Email sent successfully via SendGrid");
  } catch (err) {
    console.error("❌ SendGrid email error:", err.response?.body || err.message);
  }
};
