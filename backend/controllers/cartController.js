const Cart = require('../models/Cart');
const Product = require('../models/Product');

// POST /api/cartdata/:proid
const addToCart = async (req, res) => {
    try {
        const proid = req.params.proid;
        const quantity = req.body.value === undefined ? 1 : Number(req.body.value);
        const item = await Product.findById(proid);

        if (!item) return res.status(404).send({ statuscode: 0, message: 'Product not found' });
        if (!Number.isInteger(quantity) || quantity < 1 || item.Stock < quantity) {
            return res.status(400).send({ statuscode: 0, message: 'Requested quantity is not in stock' });
        }

        const exist = await Cart.findOne({ ProductId: proid, User: req.body.id });
        if (exist) return res.send({ statuscode: 2, message: 'Already in Cart' });

        await new Cart({
            ProductId: proid,
            Name: item.ProductName,
            Price: item.ProductPrice,
            Img: item.Img,
            Quantity: quantity,
            User: req.body.id
        }).save();

        res.send({ statuscode: 1 });
    } catch (err) {
        console.error('Error adding cart item', err);
        res.status(500).send({ statuscode: 0, message: 'Could not add item to cart' });
    }
};

// GET /api/getcartdata/:id
const getCartData = async (req, res) => {
    const result = await Cart.find({ User: req.params.id });
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// DELETE /api/remove/:id
const removeCartItem = async (req, res) => {
    const result = await Cart.deleteOne({ _id: req.params.id });
    res.send({ statuscode: result.deletedCount === 1 ? 1 : 0 });
};

// DELETE /api/removecartdata/:id
const clearCart = async (req, res) => {
    const result = await Cart.deleteMany({ User: req.params.id });
    res.send({ statuscode: result.deletedCount > 0 ? 1 : 0 });
};

// PUT /api/cartquantity/:id
const updateCartQuantity = async (req, res) => {
    try {
        const quantity = Number(req.body.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).send({ statuscode: 0, message: 'Quantity must be at least 1' });
        }

        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) return res.status(404).send({ statuscode: 0, message: 'Cart item not found' });

        const item = await Product.findById(cartItem.ProductId);
        if (!item || item.Stock < quantity) {
            return res.status(400).send({ statuscode: 0, message: 'Only the available stock can be added' });
        }

        cartItem.Quantity = quantity;
        await cartItem.save();
        res.send({ statuscode: 1, data: cartItem });
    } catch (err) {
        console.error('Error updating cart quantity', err);
        res.status(500).send({ statuscode: 0, message: 'Could not update cart quantity' });
    }
};

module.exports = { addToCart, getCartData, removeCartItem, clearCart, updateCartQuantity };
