const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connect(process.env.Mongo_url)
        .then(() => console.log('MongoDB connected'))
        .catch(() => console.log('MongoDB connection failed'));
};

module.exports = connectDB;
