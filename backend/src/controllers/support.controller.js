import { sendEmail } from "../utils/email.js";

export const contactSupport = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Email to Admin/Support
        const adminHtml = `
      <h3>New Support Request</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

        const adminEmail = process.env.EMAIL_USER || "admin@memoryhub.com";
        await sendEmail(adminEmail, `Support: ${subject}`, message, adminHtml);

        // Auto-reply to User
        const userHtml = `
      <h3>Hello ${name},</h3>
      <p>We have received your message regarding "<strong>${subject}</strong>".</p>
      <p>Our support team will get back to you as soon as possible.</p>
      <br/>
      <p>Best regards,</p>
      <p>The MemoryHub Team</p>
    `;

        await sendEmail(email, "We received your message - MemoryHub Support", "We received your message.", userHtml);

        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Contact support error:", error);
        res.status(500).json({ message: "Failed to send message", error: error.message, stack: error.stack });
    }
};
