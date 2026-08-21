const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.put('/resetpassword/:mail', resetPassword);

module.exports = router;
