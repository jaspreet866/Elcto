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
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        const msg = 'BREVO_API_KEY is not configured in environment variables';
        console.warn(`[OTP] ${msg}`);
        console.log(`\n===============================================\n🔑 [OTP CODE for ${email}]: ${otp}\n===============================================\n`);
        return { success: false, error: msg };
    }

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
            console.log(`[OTP] Email sent via Brevo API to ${email}`);
            return { success: true };
        } else {
            const errData = await response.json().catch(() => null);
            const errText = errData?.message || `HTTP ${response.status}`;
            console.warn(`[OTP] Brevo API error (${response.status}):`, errText);
            console.log(`\n===============================================\n🔑 [OTP CODE for ${email}]: ${otp}\n===============================================\n`);
            return { success: false, error: `Brevo (${response.status}): ${errText}` };
        }
    } catch (apiErr) {
        console.warn(`[OTP] Brevo API failed for ${email}:`, apiErr.message);
        console.log(`\n===============================================\n🔑 [OTP CODE for ${email}]: ${otp}\n===============================================\n`);
        return { success: false, error: `Network error: ${apiErr.message}` };
    }
};

const checkEmailHealth = async (req, res) => {
    const apiKey = process.env.BREVO_API_KEY;
    const sender = process.env.BREVO_SENDER_EMAIL;

    if (!apiKey) {
        return res.status(500).json({
            ok: false,
            error: 'BREVO_API_KEY is missing from environment variables on this server'
        });
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/account', {
            headers: {
                'accept': 'application/json',
                'api-key': apiKey
            }
        });
        const data = await response.json().catch(() => ({}));
        if (response.ok) {
            return res.json({
                ok: true,
                message: 'Brevo API is connected and verified!',
                senderConfigured: sender || 'not set (using default)',
                accountEmail: data.email,
                creditsRemaining: data.plan?.[0]?.credits
            });
        } else {
            return res.status(response.status).json({
                ok: false,
                status: response.status,
                brevoMessage: data.message || data
            });
        }
    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err.message
        });
    }
};

module.exports = { createOtp, saveOtpForEmail, getOtpForEmail, deleteOtpForEmail, sendOtpEmail, checkEmailHealth };
