const express = require('express');
const router = express.Router();
const { addReview, getReview } = require('../controllers/reviewController');

router.post('/reviews', addReview);
router.get('/getreview/:id', getReview);

module.exports = router;
