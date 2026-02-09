import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    if (!to) {
      console.error("❌ Email sending failed: Recipient email (to) is missing");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });


    const mailOptions = {
      from: `"Event Management" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    if (err.response) console.error("SMTP Response:", err.response);
  }
};
