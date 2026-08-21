const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createOtp, saveOtpForEmail, getOtpForEmail, deleteOtpForEmail, sendOtpEmail } = require('../config/mailer');

const JWT_SECRET = process.env.JWT_SECRET || '$@*#5gf*yre@gutcf&@*#$234ju6';
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.{8,}).*$/;

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const emailQuery = (email) => {
    const emailRegex = new RegExp(`^${escapeRegExp(email)}$`, 'i');
    return { $or: [{ Email: emailRegex }, { email: emailRegex }] };
};

// POST /api/register
const register = async (req, res) => {
    const verify = (req.body.email || '').trim().toLowerCase();
    const exist = await User.findOne(emailQuery(verify));

    if (!passwordRegex.test(req.body.pass)) {
        return res.send({ statuscode: 3, message: '🚨 Password must contain Uppercase, Lowercase, Number & Special character' });
    }
    if (exist) {
        return res.send({ statuscode: 2, message: 'Email is Already Used' });
    }

    const hash = bcrypt.hashSync(req.body.pass, 10);
    const result = new User({
        FirstName: req.body.fname,
        LastName: req.body.lname,
        Email: verify,
        Password: hash,
        UserType: 'User',
        Status: 'Active'
    });
    const saved = await result.save();
    res.send({ statuscode: saved ? 1 : 0 });
};

// POST /api/login
const login = async (req, res) => {
    const email = (req.body.email || '').trim().toLowerCase();
    const result = await User.findOne(emailQuery(email));
    if (!result) {
        return res.send({ statuscode: 0, message: 'Invalid email or password' });
    }
    const passMatch = bcrypt.compareSync(req.body.pass, result.Password);
    if (passMatch && result.Status === 'Active') {
        const token = jwt.sign({ id: result._id, usertype: result.UserType, mail: result.Email }, JWT_SECRET, { expiresIn: '1h' });
        res.send({ statuscode: 1, data: result, jwtoken: token });
    } else {
        res.send({ statuscode: 0 });
    }
};

// POST /api/forgot
const forgotPassword = async (req, res) => {
    const email = (req.body.email || '').trim().toLowerCase();
    if (!email) return res.send({ statuscode: 2, message: 'Email is required' });

    try {
        const exist = await User.findOne(emailQuery(email));
        if (!exist) return res.send({ statuscode: 0, message: 'No account found with this email address' });

        const otp = createOtp();
        saveOtpForEmail(email, otp);
        const emailDelivered = await sendOtpEmail(email, otp);
        console.log(`[Forgot Password] OTP generated for ${email}: ${otp}`);

        return res.send({
            statuscode: 1,
            message: emailDelivered ? 'OTP sent to your email' : 'OTP generated successfully! Check your email',
            demoOtp: otp
        });
    } catch (err) {
        console.error('Forgot password error:', err);
        return res.status(500).send({ statuscode: 0, message: 'Unable to send OTP right now' });
    }
};

// POST /api/verify-otp
const verifyOtp = async (req, res) => {
    const email = (req.body.email || '').trim().toLowerCase();
    const otp = (req.body.otp || '').toString().trim();

    if (!email || !otp) return res.send({ statuscode: 2, message: 'Email and OTP are required' });

    const savedOtp = getOtpForEmail(email);
    if (!savedOtp) return res.send({ statuscode: 0, message: 'Invalid OTP or OTP has expired' });
    if (Date.now() > savedOtp.expiresAt) {
        deleteOtpForEmail(email);
        return res.send({ statuscode: 0, message: 'OTP has expired. Please request a new code.' });
    }
    if (savedOtp.code !== otp) return res.send({ statuscode: 0, message: 'Invalid OTP code. Please check and try again.' });

    deleteOtpForEmail(email);
    return res.send({ statuscode: 1, message: 'OTP Verified Successfully' });
};

// PUT /api/resetpassword/:mail
const resetPassword = async (req, res) => {
    const email = (req.params.mail || '').trim().toLowerCase();
    const { pass, cpass } = req.body;

    if (!email || !pass || !cpass) return res.send({ statuscode: 2, message: 'Email, password and confirm password are required' });
    if (pass !== cpass) return res.send({ statuscode: 4, message: 'Password and confirm password do not match' });
    if (!passwordRegex.test(pass)) return res.send({ statuscode: 3, message: '🚨 Password must contain Uppercase, Lowercase, Number & Special character (minimum 8 characters)' });

    const exist = await User.findOne(emailQuery(email));
    if (!exist) return res.send({ statuscode: 0, message: 'No account found with this email' });

    const hash = bcrypt.hashSync(pass, 10);
    const result = await User.updateOne(emailQuery(email), { $set: { Password: hash } });

    if (result.matchedCount > 0 || result.modifiedCount > 0) {
        res.send({ statuscode: 1, message: 'Password updated successfully' });
    } else {
        res.send({ statuscode: 0, message: 'Password was not updated' });
    }
};

module.exports = { register, login, forgotPassword, verifyOtp, resetPassword };
