// backend/utils/sendEmail.js

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: options.from || process.env.EMAIL_FROM, // Use custom 'from' if provided, else default to env var
        to: options.to, // Corrected to use options.to
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo, // Add replyTo option
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
