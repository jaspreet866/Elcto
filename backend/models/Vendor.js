const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Phone: String,
    Password: String,
    Username: String,
    Bank: String,
    City: String,
    State: String,
    UserType: String,
    Status: String
});

module.exports = mongoose.model('Vendor', VendorSchema);
