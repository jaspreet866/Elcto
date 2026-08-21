const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    ProductId: String,
    Name: String,
    Price: String,
    Img: String,
    Quantity: Number,
    User: String
});

module.exports = mongoose.model('Cart', CartSchema);
