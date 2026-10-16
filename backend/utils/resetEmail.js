const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async (toEmail, resetURL) => {
  try {
    // email options
    const mailOptions = {
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

    await sendEmail(mailOptions);
    console.log("✅ Reset password email sent to:", toEmail);
  } catch (err) {
    console.error("❌ Error sending reset email:", err);
    throw err;
  }
};

module.exports = sendResetPasswordEmail;
