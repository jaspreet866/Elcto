const Brand = require('../models/Brand');

// POST /api/brand
const addBrand = async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).send({ statuscode: 0, message: 'Brand image is required' });
        }
        const result = new Brand({ BrandName: req.body.brandname, Category: req.body.category, Img: req.file.path });
        const resp = await result.save();
        res.send({ statuscode: resp ? 1 : 0 });
    } catch (err) {
        console.error('Error in /api/brand', err);
        res.status(500).send({ statuscode: 0, message: err.message });
    }
};

// GET /api/showbrand
const getAllBrands = async (req, res) => {
    const result = await Brand.find();
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/getbrand/:id
const getBrandsByCategory = async (req, res) => {
    const result = await Brand.find({ Category: req.params.id });
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/getbrand2/:id  (same logic, kept for API compatibility)
const getBrandsByCategory2 = async (req, res) => {
    const result = await Brand.find({ Category: req.params.id });
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

module.exports = { addBrand, getAllBrands, getBrandsByCategory, getBrandsByCategory2 };
