const Product = require('../models/Product');

// POST /api/product
const addProduct = (req, res) => {
    const upload = require('../middleware/upload');
    upload.any()(req, res, async function (uploadErr) {
        if (uploadErr) {
            console.error('Upload error in /api/product', uploadErr);
            return res.status(500).send({ statuscode: 0, error: uploadErr.message });
        }
        try {
            const uploadedFiles = req.files || (req.file ? [req.file] : []);
            const imagePaths = uploadedFiles.map(f => f.path || f.secure_url || f.filename);
            const stock = Number(req.body.stock);

            if (!Number.isInteger(stock) || stock < 0) {
                return res.status(400).send({ statuscode: 0, error: 'Stock must be a non-negative whole number' });
            }

            const result = new Product({
                Category: req.body.productt,
                ProductName: req.body.name,
                ProductPrice: req.body.price,
                ProductDetail: req.body.detail,
                OnSale: req.body.sale,
                Date: new Date(),
                SalePrice: req.body.saleprice,
                Brand: req.body.brand,
                Specifications: req.body.Specifications,
                Img: imagePaths[0] || '',
                Stock: req.body.stock,
                Images: imagePaths,
                AddedBy: req.body.addedBy,
                VendorId: req.body.vendorid
            });

            const resp = await result.save();
            if (resp) {
                res.send({ statuscode: 1, data: { id: resp._id, stock: resp.Stock } });
            } else {
                res.send({ statuscode: 0 });
            }
        } catch (err) {
            console.error('Error in /api/product', err);
            res.status(500).send({ statuscode: 0, error: err.message });
        }
    });
};

// PUT /api/updatepro/:id
const updateProduct = (req, res) => {
    const upload = require('../middleware/upload');
    upload.any()(req, res, async function (uploadErr) {
        if (uploadErr) {
            console.error('Upload error in /api/updatepro/:id', uploadErr);
            return res.status(500).send({ statuscode: 0, error: uploadErr.message });
        }
        try {
            const updateFields = {
                Category: req.body.productt,
                ProductName: req.body.name,
                ProductPrice: req.body.price,
                ProductDetail: req.body.detail,
                OnSale: req.body.sale,
                Date: new Date(),
                SalePrice: req.body.saleprice,
                Brand: req.body.brand,
                Specifications: req.body.specifications || req.body.Specifications
            };

            const uploadedFiles = req.files || (req.file ? [req.file] : []);
            if (uploadedFiles.length > 0) {
                const imagePaths = uploadedFiles.map(f => f.path || f.secure_url || f.filename);
                updateFields.Img = imagePaths[0];
                updateFields.Images = imagePaths;
            }

            const result = await Product.updateOne({ _id: req.params.id }, { $set: updateFields });
            if (result.modifiedCount === 1 || result.matchedCount === 1) {
                res.send({ statuscode: 1 });
            } else {
                res.send({ statuscode: 0, message: 'No changes made' });
            }
        } catch (err) {
            console.error('Error in /api/updatepro/:id', err);
            res.status(500).send({ statuscode: 0, error: err.message });
        }
    });
};

// GET /api/getproduct
const getAllProducts = async (req, res) => {
    const result = await Product.find();
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/laptop
const getLaptops = async (req, res) => {
    const result = await Product.find({ Category: '6970dd60300a757a6dcdb92e' }).limit(8);
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/mobiles
const getMobiles = async (req, res) => {
    const result = await Product.find({ Category: '6970dd2d300a757a6dcdb92a' }).limit(8);
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/leds
const getLEDs = async (req, res) => {
    const result = await Product.find({ Category: '6970dd16300a757a6dcdb928' });
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/airpods
const getAirpods = async (req, res) => {
    const result = await Product.find({ Category: '69849f299a77c6ecd3c2839b' });
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/related/:id
const getRelated = async (req, res) => {
    const result = await Product.find({ Category: req.params.id });
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/relatedtwo/:id
const getRelatedRandom = async (req, res) => {
    const result = await Product.aggregate([
        { $match: { Category: req.params.id } },
        { $sample: { size: 4 } }
    ]);
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/brand/:id  (products by brand)
const getProductsByBrand = async (req, res) => {
    const result = await Product.find({ Brand: req.params.id });
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/saleproduct
const getSaleProducts = async (req, res) => {
    const result = await Product.find({ OnSale: true }).limit(4);
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/latestproduct
const getLatestProducts = async (req, res) => {
    const result = await Product.find().sort({ _id: -1 }).limit(4);
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/vendorproduct/:id
const getVendorProducts = async (req, res) => {
    const result = await Product.find({ VendorId: req.params.id });
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/detail/:id
const getProductDetail = async (req, res) => {
    const result = await Product.findOne({ _id: req.params.id });
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// DELETE /api/deletepro/:id
const deleteProduct = async (req, res) => {
    const result = await Product.deleteOne({ _id: req.params.id });
    res.send({ statuscode: result.deletedCount === 1 ? 1 : 0 });
};

module.exports = {
    addProduct,
    updateProduct,
    getAllProducts,
    getLaptops,
    getMobiles,
    getLEDs,
    getAirpods,
    getRelated,
    getRelatedRandom,
    getProductsByBrand,
    getSaleProducts,
    getLatestProducts,
    getVendorProducts,
    getProductDetail,
    deleteProduct
};
