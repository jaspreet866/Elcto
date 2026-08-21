const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    Productid: String,
    Name: String,
    Img: String,
    SalePrice: String,
    Price: Number,
    Date: String,
    UserId: String
});

module.exports = mongoose.model('Wishlist', WishlistSchema);
