// backend/utils/sendEmail.js

const sendEmail = async (options) => {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = options.from || process.env.EMAIL_FROM?.trim();
    if (!apiKey || !from) {
        const error = new Error('Email is not configured: set RESEND_API_KEY and EMAIL_FROM');
        error.status = 503;
        throw error;
    }

    const payload = {
        from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
    };

    // HTTPS works on Render Free, where standard SMTP ports are blocked.
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    if (!response.ok) {
        const error = new Error(`Resend email failed (${response.status}): ${result.message || 'Request rejected'}`);
        error.status = 502;
        throw error;
    }
    return result;
};

module.exports = sendEmail;
