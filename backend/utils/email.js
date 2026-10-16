const sendEmail = require("./sendEmail");

async function sendVerificationEmail(to, url) {
  const mailOptions = {
    to,
    subject: "Verify your Neuralift account",
    html: `
      <h2>Verify your email</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${url}" target="_blank">Verify Email</a>
    `,
  };

  await sendEmail(mailOptions);
  console.log("✅ Verification email sent to:", to);
}

module.exports = sendVerificationEmail;
