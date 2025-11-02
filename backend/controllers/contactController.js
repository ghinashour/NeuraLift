// backend/controllers/contactController.js

const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail'); // Import the email utility

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
    const { firstName, email, subject, message } = req.body;

    // Basic validation
    if (!firstName || !email || !message) {
        res.status(400);
        throw new Error('Please enter your name, email, and message');
    }

    // 1. Sanitize input data (add this later if needed)
    // 2. Send an email to the support team
    try {
        // Email to support (from your Noreply, with Reply-To set to user)
        await sendEmail({
            to: process.env.CONTACT_EMAIL || 'helpcenter.neuraLift@gmail.com', // Send to your support email
            from: process.env.EMAIL_FROM, // Sender will be your Noreply address (enforced by Gmail)
            replyTo: `${firstName} <${email}>`, // Replies go back to the user
            subject: `New Contact Form Submission from ${firstName} (${email}): ${subject || 'No Subject'}`,
            html: `
        <p>You have a new contact form submission from your website.</p>
        <p>--- Message from: <strong>${firstName} (${email})</strong> ---</p>
        <h3>Contact Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${firstName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Subject:</strong> ${subject || 'N/A'}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message}</p>
      `,
            text: `New Contact Form Submission from ${firstName} (${email}):\n--- Message from: ${firstName} (${email}) ---\nName: ${firstName}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\nMessage: ${message}`,
        });
        console.log('Contact email sent to support successfully.');

        // Send an automated thank you email to the user
        await sendEmail({
            to: email, // Send to the user's email address
            from: process.env.EMAIL_FROM, // Sender will be your Noreply address
            subject: 'Thank you for contacting NeuraLift Support',
            html: `
        <p>Dear ${firstName},</p>
        <p>Thank you for contacting NeuraLift Support. We have received your message and will get back to you as soon as possible.</p>
        <p>Your inquiry is important to us, and we appreciate your patience.</p>
        <p>Best regards,</p>
        <p>The NeuraLift Support Team</p>
      `,
            text: `Dear ${firstName},
Thank you for contacting NeuraLift Support. We have received your message and will get back to you as soon as possible.
Your inquiry is important to us, and we appreciate your patience.
Best regards,
The NeuraLift Support Team`,
        });
        console.log('Automated thank you email sent to user successfully.');

    } catch (error) {
        console.error('Error sending contact email(s):', error);
        // Even if email fails, we still want to tell the user the form was submitted successfully from frontend perspective
    }

    // 3. Potentially save the message to a database (add this later if needed)
    // 4. Respond to the user

    res.status(200).json({
        message: 'Your message has been sent successfully!'
    });
});

module.exports = { submitContactForm };
