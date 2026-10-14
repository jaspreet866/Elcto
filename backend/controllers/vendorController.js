const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

const JWT_SECRET = process.env.JWT_SECRET || '$@*#5gf*yre@gutcf&@*#$234ju6';

// POST /api/vendorregister
const registerVendor = async (req, res) => {
    try {
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
    } catch (err) {
        console.error('Error in registerVendor:', err);
        res.status(500).send({ statuscode: 0, error: err.message });
    }
};

// GET /api/vendordata
const getAllVendors = async (req, res) => {
    try {
        const result = await Vendor.find();
        res.send({ statuscode: 1, data: result });
    } catch (err) {
        console.error('Error in getAllVendors:', err);
        res.status(500).send({ statuscode: 0, error: err.message });
    }
};

// POST /api/vlog
const vendorLogin = async (req, res) => {
    try {
        const result = await Vendor.findOne({ Email: req.body.email });
        if (!result) return res.send({ statuscode: 0 });

        const passMatch = bcrypt.compareSync(req.body.pass, result.Password);
        if (result.Email === req.body.email && passMatch && (result.Status === 'Accept' || result.Status === 'Approved')) {
            const vtoken = jwt.sign({ id: result._id, usertype: result.UserType, mail: result.Email }, JWT_SECRET, { expiresIn: '1h' });
            res.send({ statuscode: 1, data: result, token: vtoken });
        } else {
            res.send({ statuscode: 0 });
        }
    } catch (err) {
        console.error('Error in vendorLogin:', err);
        res.status(500).send({ statuscode: 0, error: err.message });
    }
};

// PUT /api/approval/:id
const vendorApproval = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).send({ statuscode: 0, message: 'Status is required' });
        }

        const result = await Vendor.findByIdAndUpdate(
            req.params.id,
            { $set: { Status: status } },
            { new: true }
        );

        if (!result) {
            return res.status(404).send({ statuscode: 0, message: 'Vendor not found' });
        }

        res.send({ statuscode: 1, message: 'Vendor status updated successfully', data: result });
    } catch (err) {
        console.error('Error in vendorApproval:', err);
        res.status(500).send({ statuscode: 0, error: err.message });
    }
};

module.exports = { registerVendor, getAllVendors, vendorLogin, vendorApproval };
