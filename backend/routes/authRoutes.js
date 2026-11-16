const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController');
const { checkEmailHealth } = require('../config/mailer');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.put('/resetpassword/:mail', resetPassword);
router.get('/email-health', checkEmailHealth);
router.get('/verify-token', verifyToken, (req, res) => {
    res.send({ statuscode: 1, message: 'Token is valid', user: req.user });
});

module.exports = router;
