import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter;

const createTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    console.log("No email credentials found. Using Ethereal for testing.");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

// Initialize transporter
createTransporter().catch(err => console.error("Failed to create email transporter:", err));

export const sendEmail = async (to, subject, text, html) => {
  try {
    if (!transporter) await createTransporter();

    // Use EMAIL_FROM if set, otherwise EMAIL_USER, otherwise fallback
    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || '"PicnicHub Support" <noreply@picnichub.com>';

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    if (nodemailer.getTestMessageUrl(info)) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
