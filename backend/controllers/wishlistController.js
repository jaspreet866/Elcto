const Wishlist = require('../models/Wishlist');

// POST /api/wishpost/:proid
const addToWishlist = async (req, res) => {
    const proid = req.params.proid;
    const exists = await Wishlist.findOne({ Productid: proid, UserId: req.body.id });

    if (exists) return res.send({ statuscode: 2, message: 'Already in Wishlist' });

    const result = new Wishlist({
        Productid: proid,
        Name: req.body.name,
        Img: req.body.img,
        SalePrice: req.body.saleprice,
        Price: req.body.price,
        Date: new Date(),
        UserId: req.body.id
    });
    const saved = await result.save();
    res.send({ statuscode: saved ? 1 : 0 });
};

// GET /api/getwish/:id
const getWishlist = async (req, res) => {
    const result = await Wishlist.find({ UserId: req.params.id });
    res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
};

// DELETE /api/deletewish/:id
const deleteWishlistItem = async (req, res) => {
    const result = await Wishlist.deleteOne({ _id: req.params.id });
    res.send({ statuscode: result.deletedCount === 1 ? 1 : 0 });
};

module.exports = { addToWishlist, getWishlist, deleteWishlistItem };
