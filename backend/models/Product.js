const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    Category: String,
    ProductName: String,
    ProductPrice: Number,
    ProductDetail: String,
    OnSale: String,
    SalePrice: String,
    Date: String,
    Img: String,
    Stock: Number,
    Images: [String],
    Brand: String,
    Specifications: String,
    AddedBy: String,
    VendorId: String
});

module.exports = mongoose.model('Product', ProductSchema);
