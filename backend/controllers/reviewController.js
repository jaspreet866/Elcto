const Review = require('../models/Review');

// POST /api/reviews
const addReview = async (req, res) => {
    try {
        const result = new Review({
            Name: req.body.username,
            User: req.body.mail,
            Msg: req.body.msg,
            Rating: req.body.rating,
            Date: new Date(),
            Product: req.body.prr
        });
        const saved = await result.save();
        res.send({ statuscode: saved ? 1 : 0, data: saved });
    } catch (err) {
        console.error('Add review error:', err);
        res.status(500).send({ statuscode: 0, error: err.message });
    }
};

// GET /api/getreview/:id
const getReview = async (req, res) => {
    try {
        // Return all reviews for the product, newest first
        const result = await Review.find({ Product: req.params.id }).sort({ _id: -1 });
        res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
    } catch (err) {
        console.error('Get review error:', err);
        res.status(500).send({ statuscode: 0, error: err.message });
    }
};

// DELETE /api/deletereview/:id
const deleteReview = async (req, res) => {
    try {
        const result = await Review.findByIdAndDelete(req.params.id);
        if (result) {
            res.send({ statuscode: 1, message: 'Review deleted successfully' });
        } else {
            res.send({ statuscode: 0, message: 'Review not found' });
        }
    } catch (err) {
        console.error('Delete review error:', err);
        res.status(500).send({ statuscode: 0, error: err.message });
    }
};

module.exports = { addReview, getReview, deleteReview };
