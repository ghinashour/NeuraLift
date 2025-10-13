const nodemailer = require("nodemailer");

const sendResetPasswordEmail = async (toEmail, resetURL) => {
  try {
    // transporter setup (using Gmail here, but you can switch to SendGrid, Mailgun, etc.)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or "smtp"
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password (not real Gmail password)
      },
    });

    // email options
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}" target="_blank" 
           style="display:inline-block;padding:10px 20px;margin-top:10px;
                  background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
        <p>This link is valid for <b>1 hour</b>. If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Reset password email sent to:", toEmail);
  } catch (err) {
    console.error("❌ Error sending reset email:", err);
    throw new Error("Could not send reset email");
  }
};

module.exports = sendResetPasswordEmail;
