const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || '$@*#5gf*yre@gutcf&@*#$234ju6';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ statuscode: 0, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).send({ statuscode: 0, message: 'Invalid or expired token.' });
    }
};

module.exports = { verifyToken };
