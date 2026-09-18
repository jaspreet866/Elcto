const { processRAGChat } = require('../services/ragService');

/**
 * Handle incoming chat message with RAG processing
 * POST /api/chat
 */
const handleChat = async (req, res) => {
    try {
        const { message, history, userId } = req.body;

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).send({
                statuscode: 0,
                error: 'Message is required and must be a non-empty string.'
            });
        }

        const result = await processRAGChat({
            message: message.trim(),
            history: Array.isArray(history) ? history : [],
            userId: userId || null
        });

        return res.send({
            statuscode: 1,
            reply: result.reply,
            products: result.products || [],
            source: result.source || 'rag-engine',
            model: result.model || null,
            notice: result.notice || null
        });
    } catch (err) {
        console.error('Chat controller error:', err);
        return res.status(500).send({
            statuscode: 0,
            error: 'Failed to process chat message',
            message: err.message
        });
    }
};

/**
 * Get popular prompt suggestions for chatbot launcher
 * GET /api/chat/suggestions
 */
const getSuggestions = (req, res) => {
    const suggestions = [
        { id: 1, icon: '💻', text: 'Best laptops for work & gaming' },
        { id: 2, icon: '📱', text: 'Show me top smartphones' },
        { id: 3, icon: '🔥', text: 'What is on sale right now?' },
        { id: 4, icon: '🎧', text: 'Recommend wireless AirPods / earbuds' },
        { id: 5, icon: '📦', text: 'Where is my order?' },
        { id: 6, icon: '🛡️', text: 'What is your warranty & return policy?' }
    ];

    res.send({
        statuscode: 1,
        suggestions
    });
};

module.exports = {
    handleChat,
    getSuggestions
};
