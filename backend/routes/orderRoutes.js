const express = require('express');
const router = express.Router();
const { checkout, getAllOrders, getMyOrders, getMonthlySales } = require('../controllers/orderController');

router.post('/checkout', checkout);
router.get('/orderdata', getAllOrders);
router.get('/myorder/:id', getMyOrders);
router.get('/sales/monthly', getMonthlySales);

module.exports = router;
