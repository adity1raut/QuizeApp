import User from "../../models/UserSchema.js"
import generateToken from "../../utils/GenerateToken.js"

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            generateToken(res, user); 

            res.status(200).json({
                message: 'Logged in successfully!',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
};


const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully.' });
};

module.exports = {
    loginUser,
    logoutUser,
};
