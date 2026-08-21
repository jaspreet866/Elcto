const Review = require('../models/Review');

// POST /api/reviews
const addReview = async (req, res) => {
    const result = new Review({
        Name: req.body.username,
        User: req.body.mail,
        Msg: req.body.msg,
        Rating: req.body.rating,
        Date: new Date(),
        Product: req.body.prr
    });
    const saved = await result.save();
    res.send({ statuscode: saved ? 1 : 0 });
};

// GET /api/getreview/:id
const getReview = async (req, res) => {
    const result = await Review.find({ Product: req.params.id }).sort({ _id: -1 }).limit(1);
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

module.exports = { addReview, getReview };
