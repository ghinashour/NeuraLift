const nodemailer = require("nodemailer");

// Create test account automatically for Ethereal
async function createTestAccount() {
  return await nodemailer.createTestAccount();
}

async function sendVerificationEmail(to, url) {
  const testAccount = await createTestAccount();

  // Transporter setup (using Ethereal’s fake SMTP)
  const transporter = nodemailer.createTransport({
     service: "gmail", 
    auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Neuralift" <${process.env.MAIL_USER}>`,
    to,
    subject: "Verify your Neuralift account",
    html: `
      <h2>Verify your email</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${url}" target="_blank">Verify Email</a>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Verification email sent to:", to);
}

module.exports = sendVerificationEmail;
