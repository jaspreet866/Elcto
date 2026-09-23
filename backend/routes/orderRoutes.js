const express = require('express');
const router = express.Router();
const { checkout, getAllOrders, getMyOrders, getMonthlySales, updateOrderStatus } = require('../controllers/orderController');

router.post('/checkout', checkout);
router.get('/orderdata', getAllOrders);
router.get('/myorder/:id', getMyOrders);
router.get('/sales/monthly', getMonthlySales);
router.put('/order/status/:id', updateOrderStatus);

module.exports = router;
