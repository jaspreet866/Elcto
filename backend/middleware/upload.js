const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const myStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'electomart',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif']
    }
});

const upload = multer({ storage: myStorage });

module.exports = upload;
