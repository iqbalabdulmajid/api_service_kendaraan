const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Akses ditolak. Token tidak ada." });

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), 'SECRET_KEY_KAMU');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Token tidak valid." });
    }
};