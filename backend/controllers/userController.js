const User = require('../models/User');

// GET /api/users
const getAllUsers = async (req, res) => {
    const result = await User.find();
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// PUT /api/makeadmin/:id
const makeAdmin = async (req, res) => {
    const result = await User.updateOne({ _id: req.params.id }, { $set: { UserType: req.body.ad } });
    res.send({ statuscode: result.modifiedCount === 1 ? 1 : 0 });
};

// PUT /api/changestatus/:id
const changeStatus = async (req, res) => {
    const result = await User.updateOne({ _id: req.params.id }, { $set: { Status: req.body.status } });
    res.send({ statuscode: result.modifiedCount === 1 ? 1 : 0 });
};

module.exports = { getAllUsers, makeAdmin, changeStatus };
