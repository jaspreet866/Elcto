const express = require('express');
const router = express.Router();
const {
    addProduct, updateProduct, getAllProducts,
    getLaptops, getMobiles, getLEDs, getAirpods,
    getRelated, getRelatedRandom, getProductsByBrand,
    getSaleProducts, getLatestProducts, getVendorProducts,
    getProductDetail, deleteProduct
} = require('../controllers/productController');

router.post('/product', addProduct);
router.put('/updatepro/:id', updateProduct);
router.get('/getproduct', getAllProducts);
router.get('/laptop', getLaptops);
router.get('/mobiles', getMobiles);
router.get('/leds', getLEDs);
router.get('/airpods', getAirpods);
router.get('/related/:id', getRelated);
router.get('/relatedtwo/:id', getRelatedRandom);
router.get('/brand/:id', getProductsByBrand);
router.get('/saleproduct', getSaleProducts);
router.get('/latestproduct', getLatestProducts);
router.get('/vendorproduct/:id', getVendorProducts);
router.get('/detail/:id', getProductDetail);
router.delete('/deletepro/:id', deleteProduct);

module.exports = router;
