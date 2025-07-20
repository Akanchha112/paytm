const { JWT_SECRET } = require('./config');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if authHeader is a valid string
    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "Unauthorized: Token missing or malformed" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.id) { 
            req.userId = decoded.id;
            next();
        } else {
            return res.status(403).json({ msg: "Forbidden: Invalid token payload" });
        }
    } catch (err) {
        return res.status(401).json({ msg: "Unauthorized: Invalid token", err: err.message });
    }
};

module.exports = { auth };
