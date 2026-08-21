const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    Name: String,
    Img: String
});

module.exports = mongoose.model('category', CategorySchema);
