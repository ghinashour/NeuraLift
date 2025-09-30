const nodemailer = require("nodemailer");

// Create test account automatically for Ethereal
async function createTestAccount() {
  return await nodemailer.createTestAccount();
}

async function sendVerificationEmail(to, url) {
  const testAccount = await createTestAccount();

  // Transporter setup (using Ethereal’s fake SMTP)
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated user
      pass: testAccount.pass, // generated password
    },
  });

  // Send email
  const info = await transporter.sendMail({
    from: '"Neuralift 👋" <no-reply@Neuralift.com>',
    to, // recipient email
    subject: "Verify your email",
    html: `<p>Click <a href="${url}">here</a> to verify your account</p>`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = sendVerificationEmail;
