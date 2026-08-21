const express = require('express');
const router = express.Router();
const { getAllUsers, makeAdmin, changeStatus } = require('../controllers/userController');

router.get('/users', getAllUsers);
router.put('/makeadmin/:id', makeAdmin);
router.put('/changestatus/:id', changeStatus);

module.exports = router;
