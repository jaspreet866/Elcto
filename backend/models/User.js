const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
    FirstName: { type: String, default: '' },
    LastName: { type: String, default: '' },
    Email: { type: String, default: '' },
    Password: { type: String, default: '' },
    UserType: { type: String, default: 'User' },
    Status: { type: String, default: 'Active' },
    Bio: { type: String, default: '' },
    Phone: { type: String, default: '' },
    Address: { type: String, default: '' },
    City: { type: String, default: '' },
    State: { type: String, default: '' },
    PostalCode: { type: String, default: '' },
    Avatar: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('users', RegisterSchema);

