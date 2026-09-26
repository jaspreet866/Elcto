const crypto = require('crypto');

// In-memory OTP store: { [email]: { code, expiresAt } }
const otpStore = {};
const OTP_EXPIRY_MS = 10 * 60 * 1000;

const createOtp = () => crypto.randomInt(100000, 1000000).toString();

const saveOtpForEmail = (email, otp) => {
    otpStore[email] = {
        code: otp,
        expiresAt: Date.now() + OTP_EXPIRY_MS
    };
};

const getOtpForEmail = (email) => otpStore[email];

const deleteOtpForEmail = (email) => { delete otpStore[email]; };

const createOtpEmail = (email, otp) => {
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.MAILERSEND_SMTP_USER || 'noreply@elcto.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'Elcto Support';

    return {
        sender: {
            name: senderName,
            email: senderEmail
        },
        to: [{ email }],
        subject: 'Your Elcto Password Reset OTP',
        textContent: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        htmlContent: `<div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0;">
            <h2 style="color: #1d4ed8; margin-top: 0;">Elcto Password Reset</h2>
            <p>You requested to reset your password. Use the verification OTP below to proceed:</p>
            <div style="background: #eff6ff; border: 1px dashed #3b82f6; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1d4ed8;">${otp}</span>
            </div>
            <p style="font-size: 13px; color: #64748b;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        </div>`
    };
};

const sendOtpEmail = async (email, otp) => {
    let emailDelivered = false;

    // Send via Brevo REST API (https://api.brevo.com/v3/smtp/email)
    const apiKey = process.env.BREVO_API_KEY;
    if (apiKey) {
        try {
            const emailMessage = createOtpEmail(email, otp);
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'api-key': apiKey
                },
                body: JSON.stringify(emailMessage)
            });

            if (response.ok || response.status === 201) {
                emailDelivered = true;
                console.log(`[OTP] Email sent via Brevo API to ${email}`);
                return true;
            } else {
                const text = await response.text();
                console.warn(`[OTP] Brevo API returned ${response.status}: ${text}`);
            }
        } catch (apiErr) {
            console.warn(`[OTP] Brevo API failed for ${email}:`, apiErr.message);
        }
    } else {
        console.warn('[OTP] BREVO_API_KEY is not set in backend/.env. Falling back to console log.');
    }

    // Fallback: Always log OTP to server console so testing/auth flow is never blocked
    console.log(`\n===============================================\n🔑 [OTP CODE for ${email}]: ${otp}\n===============================================\n`);
    return emailDelivered;
};

module.exports = { createOtp, saveOtpForEmail, getOtpForEmail, deleteOtpForEmail, sendOtpEmail };
