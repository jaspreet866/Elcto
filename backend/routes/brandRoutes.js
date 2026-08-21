const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { addBrand, getAllBrands, getBrandsByCategory, getBrandsByCategory2 } = require('../controllers/brandController');

router.post('/brand', upload.single('pic'), addBrand);
router.get('/showbrand', getAllBrands);
router.get('/getbrand/:id', getBrandsByCategory);
router.get('/getbrand2/:id', getBrandsByCategory2);

module.exports = router;
