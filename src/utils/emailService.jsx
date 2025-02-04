import sgMail from "@sendgrid/mail";

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendWelcomeEmail = async (toEmail, name) => {
  const msg = {
    to: toEmail,
    from: process.env.FROM_EMAIL, // This should be your verified sender in SendGrid
    subject: "Welcome to Our Adventure!",
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>We're thrilled to have you join our adventure. Get ready for an exciting journey filled with knowledge and imagination.</p>
      <p>Here are a few things you can do to get started:</p>
      <ul>
        <li>Explore our interactive book experiences</li>
        <li>Customize your profile</li>
        <li>Connect with other adventurers</li>
      </ul>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Happy exploring!</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Welcome email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    if (error.response)
      console.error("SendGrid Response:", error.response.body);
    throw error;
  }
};
