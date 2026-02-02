const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Format: Bearer <token>
    // Just split by space usually
    const bearer = token.split(' ');
    const tokenPart = bearer.length === 2 ? bearer[1] : bearer[0];

    if (!tokenPart) {
        return res.status(403).json({ message: 'Malformed token' });
    }

    jwt.verify(tokenPart, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin' && req.userRole !== 'committee') {
        return res.status(403).json({ message: 'Require Admin Role' });
    }
    next();
};
