const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// POST /api/checkout
const checkout = async (req, res) => {
    const reducedItems = [];
    try {
        const cartItems = await Cart.find({ User: req.body.id });
        if (!cartItems.length) {
            return res.status(400).send({ statuscode: 0, message: 'Cart is empty' });
        }

        const orderItems = [];
        let total = 0;

        for (const cartItem of cartItems) {
            const quantity = Number(cartItem.Quantity);
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: cartItem.ProductId, Stock: { $gte: quantity } },
                { $inc: { Stock: -quantity } },
                { new: true }
            );

            if (!updatedProduct) {
                throw new Error(`${cartItem.Name} no longer has enough stock`);
            }

            reducedItems.push({ productId: cartItem.ProductId, quantity });
            const price = Number(updatedProduct.ProductPrice);
            orderItems.push({
                ProductId: cartItem.ProductId,
                ProductName: updatedProduct.ProductName,
                Quantity: quantity,
                Price: price,
                Img: updatedProduct.Img
            });
            total += price * quantity;
        }

        await new Order({
            FirstName: req.body.fname,
            LastName: req.body.lname,
            Phone: req.body.phn,
            Email: req.body.email,
            Country: req.body.country,
            State: req.body.state,
            City: req.body.city,
            Address: req.body.address,
            PostalCode: req.body.postal,
            Date: new Date(),
            UserId: req.body.id,
            Payment: req.body.payment,
            Total: total,
            Order: orderItems,
            OrderNo: req.body.orderno
        }).save();

        await Cart.deleteMany({ User: req.body.id });
        res.send({ statuscode: 1 });
    } catch (err) {
        // Rollback: restore stock for already-reduced items
        await Promise.all(reducedItems.map(({ productId, quantity }) =>
            Product.updateOne({ _id: productId }, { $inc: { Stock: quantity } })
        ));
        console.error('Error during checkout', err);
        res.status(400).send({ statuscode: 0, message: err.message || 'Order could not be placed' });
    }
};

// GET /api/orderdata
const getAllOrders = async (req, res) => {
    const result = await Order.find();
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/myorder/:id
const getMyOrders = async (req, res) => {
    const result = await Order.find({ UserId: req.params.id });
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// GET /api/sales/monthly
const getMonthlySales = async (req, res) => {
    const orders = await Order.find();
    const monthly = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };

    orders.forEach(order => {
        if (!Array.isArray(order.Order)) return;
        const date = new Date(order.Date);
        const monthIndex = date.getMonth();
        const months = Object.keys(monthly);
        let orderTotal = 0;
        order.Order.forEach(item => {
            orderTotal += (Number(item.Quantity) || 0) * (Number(item.Price) || 0);
        });
        monthly[months[monthIndex]] += orderTotal;
    });

    res.send({ statuscode: 1, labels: Object.keys(monthly), values: Object.values(monthly) });
};

module.exports = { checkout, getAllOrders, getMyOrders, getMonthlySales };
