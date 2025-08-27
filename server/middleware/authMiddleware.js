    import jwt from 'jsonwebtoken'
    import User from "../models/UserSchema.js"
    

    const JWT_SECRET = process.env.JWT_SECRET || "araut@12" ;

    const protect = async (req, res, next) => {
        let token;

        token = req.cookies.token;

        if (token) {
            try {
    
                const decoded = jwt.verify(token, JWT_SECRET);
                req.user = await User.findById(decoded.user.id).select('-password');
                
                next(); 
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


    export { protect, admin };
