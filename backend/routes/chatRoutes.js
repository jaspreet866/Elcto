const express = require('express');
const router = express.Router();
const { handleChat, getSuggestions } = require('../controllers/chatController');

// Rate limiter specific for chat to prevent spam while allowing active conversations
const rateLimit = require('express-rate-limit');
const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 30, // 30 requests per minute
    message: {
        statuscode: 0,
        error: 'Too many chat messages. Please wait a moment before sending another message.'
    }
});

router.post('/chat', chatLimiter, handleChat);
router.get('/chat/suggestions', getSuggestions);

module.exports = router;
