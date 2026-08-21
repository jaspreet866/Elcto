const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { addCategory, getCategories } = require('../controllers/categoryController');

router.post('/category', upload.single('pic'), addCategory);
router.get('/getcategory', getCategories);

module.exports = router;
