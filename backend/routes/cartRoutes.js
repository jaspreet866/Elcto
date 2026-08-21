const express = require('express');
const router = express.Router();
const { addToCart, getCartData, removeCartItem, clearCart, updateCartQuantity } = require('../controllers/cartController');

router.post('/cartdata/:proid', addToCart);
router.get('/getcartdata/:id', getCartData);
router.delete('/remove/:id', removeCartItem);
router.delete('/removecartdata/:id', clearCart);
router.put('/cartquantity/:id', updateCartQuantity);

module.exports = router;
