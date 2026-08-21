const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    Password: String,
    UserType: String,
    Status: String
});

module.exports = mongoose.model('users', RegisterSchema);
