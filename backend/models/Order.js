const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Phone: String,
    Email: String,
    Country: String,
    State: String,
    City: String,
    Address: String,
    PostalCode: String,
    Date: String,
    UserId: String,
    Payment: String,
    OrderNo: String,
    Total: Number,
    Order: [{
        ProductId: String,
        ProductName: String,
        Quantity: Number,
        Price: Number,
        Img: String
    }],
    OrderStatus: {
        type: String,
        default: 'Processing',
        enum: ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
    }
}, { timestamps: true });

module.exports = mongoose.model('Checkout', OrderSchema);
