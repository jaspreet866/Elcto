const express = require('express');
const router = express.Router();
const { addToWishlist, getWishlist, deleteWishlistItem } = require('../controllers/wishlistController');

router.post('/wishpost/:proid', addToWishlist);
router.get('/getwish/:id', getWishlist);
router.delete('/deletewish/:id', deleteWishlistItem);

module.exports = router;
