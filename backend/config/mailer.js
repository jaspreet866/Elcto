const nodemailer = require('nodemailer');
const crypto = require('crypto');

const mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailersend.net',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
        user: process.env.MAILERSEND_SMTP_USER,
        pass: process.env.MAILERSEND_SMTP_PASS
    }
});

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
    const senderEmail = process.env.MAILERSEND_SMTP_USER || 'noreply@elcto.com';
    return {
        from: senderEmail,
        to: email,
        subject: 'Your Elcto OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        html: `<div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0;">
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

    // 1. Attempt sending via SMTP if credentials are configured
    if (process.env.MAILERSEND_SMTP_USER && process.env.MAILERSEND_SMTP_PASS) {
        try {
            const emailMessage = createOtpEmail(email, otp);
            await mailTransporter.sendMail(emailMessage);
            emailDelivered = true;
            console.log(`[OTP] Email sent via SMTP to ${email}`);
            return true;
        } catch (smtpErr) {
            console.warn(`[OTP] SMTP send failed for ${email}:`, smtpErr.message);
        }
    }

    // 2. Attempt sending via MailerSend REST API if API Key is configured
    if (process.env.MAILERSEND_API_KEY) {
        try {
            const response = await fetch('https://api.mailersend.com/v1/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: {
                        email: process.env.MAILERSEND_SMTP_USER || 'MS_y76zKe@test-r83ql3p3mmmgzw1j.mlsender.net',
                        name: 'Elcto Support'
                    },
                    to: [{ email }],
                    subject: 'Your Elcto Password Reset OTP',
                    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
                    html: `<div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0;">
                        <h2 style="color: #1d4ed8; margin-top: 0;">Elcto Password Reset</h2>
                        <p>You requested to reset your password. Use the verification OTP below to proceed:</p>
                        <div style="background: #eff6ff; border: 1px dashed #3b82f6; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1d4ed8;">${otp}</span>
                        </div>
                        <p style="font-size: 13px; color: #64748b;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                    </div>`
                })
            });
            if (response.ok || response.status === 202) {
                emailDelivered = true;
                console.log(`[OTP] Email sent via MailerSend API to ${email}`);
                return true;
            } else {
                const text = await response.text();
                console.warn(`[OTP] MailerSend API response ${response.status}: ${text}`);
            }
        } catch (apiErr) {
            console.warn(`[OTP] MailerSend API failed for ${email}:`, apiErr.message);
        }
    }

    // 3. Fallback: Always log OTP to server console so testing is never blocked
    console.log(`\n===============================================\n🔑 [OTP CODE for ${email}]: ${otp}\n===============================================\n`);
    return emailDelivered;
};

module.exports = { createOtp, saveOtpForEmail, getOtpForEmail, deleteOtpForEmail, sendOtpEmail };
