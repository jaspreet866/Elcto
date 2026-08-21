const express = require('express');
const router = express.Router();
const { registerVendor, getAllVendors, vendorLogin, vendorApproval } = require('../controllers/vendorController');

router.post('/vendorregister', registerVendor);
router.get('/vendordata', getAllVendors);
router.post('/vlog', vendorLogin);
router.put('/approval/:id', vendorApproval);

module.exports = router;
