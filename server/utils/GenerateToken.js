import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ;

const generateToken = (res, user) => {
    const payload = {
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === 'development', // Use secure cookies in production
        sameSite: 'strict', // Mitigates CSRF attacks
        maxAge: 3600000 // 1 hour
    });
};

module.exports = generateToken;
