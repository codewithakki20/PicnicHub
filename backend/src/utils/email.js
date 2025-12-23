import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter = null;


// CREATE TRANSPORTER
const createTransporter = async () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const host = process.env.EMAIL_HOST; // Optional: "smtp.gmail.com"
  const port = process.env.EMAIL_PORT; // Optional: 587 or 465

  // ✅ Production Configuration
  if (user && pass) {
    console.log(`📧 Initializing email transporter for: ${user}`);

    // If specific host provided, use standard SMTP
    if (host) {
      transporter = nodemailer.createTransport({
        host: host,
        port: Number(port) || 587,
        secure: Number(port) === 465, // true for 465, false for other ports
        auth: {
          user: user,
          pass: pass,
        },
      });
    } else {
      // Fallback to Gmail service shortcut
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: user,
          pass: pass,
        },
      });
    }
    return;
  }

  // 🧪 Dev / Test (Ethereal)
  console.warn("⚠️ No email credentials (EMAIL_USER/EMAIL_PASS) found. Using Ethereal (test mode).");

  try {
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
    console.log("🧪 Ethereal test account created for email.");
  } catch (err) {
    console.error("❌ Failed to create Ethereal test account:", err.message);
  }
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
