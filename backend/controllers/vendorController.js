const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

const JWT_SECRET = process.env.JWT_SECRET || '$@*#5gf*yre@gutcf&@*#$234ju6';

// POST /api/vendorregister
const registerVendor = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);
    const result = new Vendor({
        Name: req.body.name,
        Email: req.body.email,
        Phone: req.body.phn,
        Password: hashedPassword,
        Username: req.body.uname,
        Bank: req.body.bank,
        City: req.body.city,
        State: req.body.state,
        UserType: 'Vendor',
        Status: 'Pending'
    });
    const resp = await result.save();
    res.send({ statuscode: resp ? 1 : 0 });
};

// GET /api/vendordata
const getAllVendors = async (req, res) => {
    const result = await Vendor.find();
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// POST /api/vlog
const vendorLogin = async (req, res) => {
    const result = await Vendor.findOne({ Email: req.body.email });
    if (!result) return res.send({ statuscode: 0 });

    const passMatch = bcrypt.compareSync(req.body.pass, result.Password);
    if (result.Email === req.body.email && passMatch && result.Status === 'Accept') {
        const vtoken = jwt.sign({ id: result._id, usertype: result.UserType, mail: result.Email }, JWT_SECRET, { expiresIn: '1h' });
        res.send({ statuscode: 1, data: result, token: vtoken });
    } else {
        res.send({ statuscode: 0 });
    }
};

// PUT /api/approval/:id
const vendorApproval = async (req, res) => {
    const result = await Vendor.updateOne({ _id: req.params.id }, { $set: { Status: req.body.status } });
    res.send({ statuscode: result.modifiedCount === 1 ? 1 : 0 });
};

module.exports = { registerVendor, getAllVendors, vendorLogin, vendorApproval };
