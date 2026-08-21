const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');

router.post('/response', submitContact);

module.exports = router;
