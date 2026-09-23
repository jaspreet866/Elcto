const bcrypt = require('bcrypt');
const User = require('../models/User');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.{8,}).*$/;

// GET /api/users
const getAllUsers = async (req, res) => {
    try {
        const result = await User.find().select('-Password');
        res.send(result ? { statuscode: 1, data: result } : { statuscode: 0 });
    } catch (err) {
        res.status(500).send({ statuscode: 0, message: err.message });
    }
};

// GET /api/userprofile/:id
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-Password');
        if (!user) {
            return res.status(404).send({ statuscode: 0, message: 'User not found' });
        }

        // Fetch aggregate stats for the profile dashboard
        const orderCount = await Order.countDocuments({ UserId: req.params.id });
        const wishlistCount = await Wishlist.countDocuments({ UserId: req.params.id });
        const orders = await Order.find({ UserId: req.params.id }).select('Total Order');
        const totalSpent = orders.reduce((sum, ord) => {
            if (ord.Total) return sum + Number(ord.Total);
            if (Array.isArray(ord.Order)) {
                return sum + ord.Order.reduce((acc, itm) => acc + ((Number(itm.Price) || 0) * (Number(itm.Quantity) || 1)), 0);
            }
            return sum;
        }, 0);

        res.send({
            statuscode: 1,
            data: user,
            stats: {
                orderCount,
                wishlistCount,
                totalSpent
            }
        });
    } catch (err) {
        res.status(500).send({ statuscode: 0, message: err.message });
    }
};

// PUT /api/updateuserprofile/:id
const updateUserProfile = async (req, res) => {
    try {
        const { FirstName, LastName, Phone, Bio, Address, City, State, PostalCode, Avatar } = req.body;
        
        const updateFields = {};
        if (FirstName !== undefined) updateFields.FirstName = FirstName.trim();
        if (LastName !== undefined) updateFields.LastName = LastName.trim();
        if (Phone !== undefined) updateFields.Phone = Phone.trim();
        if (Bio !== undefined) updateFields.Bio = Bio.trim();
        if (Address !== undefined) updateFields.Address = Address.trim();
        if (City !== undefined) updateFields.City = City.trim();
        if (State !== undefined) updateFields.State = State.trim();
        if (PostalCode !== undefined) updateFields.PostalCode = PostalCode.trim();
        if (Avatar !== undefined) updateFields.Avatar = Avatar;

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { returnDocument: 'after' }
        ).select('-Password');

        if (!updated) {
            return res.status(404).send({ statuscode: 0, message: 'User not found' });
        }

        res.send({ statuscode: 1, message: 'Profile updated successfully', data: updated });
    } catch (err) {
        res.status(500).send({ statuscode: 0, message: err.message });
    }
};

// PUT /api/updateuserpassword/:id
const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).send({ statuscode: 0, message: 'Current and new password are required' });
        }

        if (!passwordRegex.test(newPassword)) {
            return res.send({ statuscode: 3, message: '🚨 Password must contain Uppercase, Lowercase, Number & Special character (min 8 chars)' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ statuscode: 0, message: 'User not found' });
        }

        const match = await bcrypt.compare(currentPassword, user.Password);
        if (!match) {
            return res.send({ statuscode: 2, message: 'Current password is incorrect' });
        }

        const newHash = bcrypt.hashSync(newPassword, 10);
        user.Password = newHash;
        await user.save();

        res.send({ statuscode: 1, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).send({ statuscode: 0, message: err.message });
    }
};

// PUT /api/makeadmin/:id
const makeAdmin = async (req, res) => {
    const result = await User.updateOne({ _id: req.params.id }, { $set: { UserType: req.body.ad } });
    res.send({ statuscode: result.modifiedCount === 1 ? 1 : 0 });
};

// PUT /api/changestatus/:id
const changeStatus = async (req, res) => {
    const result = await User.updateOne({ _id: req.params.id }, { $set: { Status: req.body.status } });
    res.send({ statuscode: result.modifiedCount === 1 ? 1 : 0 });
};

module.exports = {
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    makeAdmin,
    changeStatus
};

