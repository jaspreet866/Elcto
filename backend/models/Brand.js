const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    BrandName: String,
    Category: String,
    Img: String
});

module.exports = mongoose.model('Brands', BrandSchema);
