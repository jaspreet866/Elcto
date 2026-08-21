const Category = require('../models/Category');

// POST /api/category
const addCategory = async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).send({ statuscode: 0, message: 'Category image is required' });
        }
        const result = new Category({ Name: req.body.name, Img: req.file.path });
        const resp = await result.save();
        res.send({ statuscode: resp ? 1 : 0 });
    } catch (err) {
        console.error('Error in /api/category', err);
        res.status(500).send({ statuscode: 0, message: err.message });
    }
};

// GET /api/getcategory
const getCategories = async (req, res) => {
    const result = await Category.find();
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

module.exports = { addCategory, getCategories };
