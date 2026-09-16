const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    makeAdmin,
    changeStatus
} = require('../controllers/userController');

router.get('/users', getAllUsers);
router.get('/userprofile/:id', getUserProfile);
router.put('/updateuserprofile/:id', updateUserProfile);
router.put('/updateuserpassword/:id', updateUserPassword);
router.put('/makeadmin/:id', makeAdmin);
router.put('/changestatus/:id', changeStatus);

module.exports = router;

