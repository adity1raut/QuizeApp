import jwt from 'jsonwebtoken'
import User from "../models/UserSchema.js"

const JWT_SECRET = process.env.JWT_SECRET ;

const protect = async (req, res, next) => {
    let token;

    token = req.cookies.token;

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Get user from the token payload (excluding the password)
            // and attach it to the request object
            req.user = await User.findById(decoded.user.id).select('-password');
            
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin.' });
    }
};


module.exports = { protect, admin };
