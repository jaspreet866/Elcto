const Contact = require('../models/Contact');

// POST /api/response
const submitContact = async (req, res) => {
    const result = new Contact({
        Name: req.body.name,
        Email: req.body.mail,
        Mobile: req.body.phn,
        Type: req.body.type,
        Msg: req.body.msg
    });
    const saved = await result.save();
    if (saved) {
        res.send({ statuscode: 1 });
    } else {
        res.send({ statuscode: 0 });
    }
};

module.exports = { submitContact };
