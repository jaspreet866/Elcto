const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Mobile: Number,
    Type: String,
    Msg: String
});

module.exports = mongoose.model('Contact', ContactSchema);
