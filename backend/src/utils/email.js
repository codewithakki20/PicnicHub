import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter = null;


// CREATE TRANSPORTER
const createTransporter = async () => {
  // ✅ Production (Gmail / custom SMTP)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    return;
  }

  // 🧪 Dev / Test (Ethereal)
  console.warn("⚠️ No email credentials found. Using Ethereal (test mode).");

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
};

// INIT ON BOOT
createTransporter().catch((err) =>
  console.error("❌ Failed to initialize email transporter:", err)
);


// SEND EMAIL
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  try {
    if (!transporter) await createTransporter();

    const from =
      process.env.EMAIL_FROM ||
      process.env.EMAIL_USER ||
      '"PicnicHub Support" <picnichub1@gmail.com>';

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log("📨 Email sent:", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("🔗 Preview URL:", previewUrl);
    }

    return info;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw new Error("Email service unavailable");
  }
};
