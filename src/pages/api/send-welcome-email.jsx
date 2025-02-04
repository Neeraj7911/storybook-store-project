import { sendWelcomeEmail } from "../../utils/emailService";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, name } = req.body;

    try {
      const result = await sendWelcomeEmail(email, name);
      res
        .status(200)
        .json({ message: "Welcome email sent successfully", result });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      res.status(500).json({ error: "Failed to send welcome email" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
