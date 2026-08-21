const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    Name: String,
    User: String,
    Msg: String,
    Rating: Number,
    Date: String,
    Product: String
});

module.exports = mongoose.model('Reviews', ReviewSchema);
