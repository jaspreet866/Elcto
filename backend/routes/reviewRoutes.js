const express = require('express');
const router = express.Router();
const { addReview, getReview, deleteReview } = require('../controllers/reviewController');

router.post('/reviews', addReview);
router.get('/getreview/:id', getReview);
router.delete('/deletereview/:id', deleteReview);

module.exports = router;
