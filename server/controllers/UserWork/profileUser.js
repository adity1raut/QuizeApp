import User from "../../models/UserSchema.js";

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.status(200).json({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: 'Server error while fetching profile.' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Update fields only if they are provided in the request body
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;

            // If a new password is provided, update it.
            // The 'pre-save' hook in your UserSchema will automatically hash it.
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.status(200).json({
                message: 'Profile updated successfully!',
                user: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                }
            });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error("Update Profile Error:", error);
        // Handle cases where the new username or email is already taken
        if (error.code === 11000) {
             return res.status(400).json({ message: 'Username or email already exists.' });
        }
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
};

const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            await User.findByIdAndDelete(req.user._id);

            // Clear the authentication cookie to log the user out
            res.cookie('token', '', {
                httpOnly: true,
                expires: new Date(0),
            });

            res.status(200).json({ message: 'User account deleted successfully.' });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error("Delete Profile Error:", error);
        res.status(500).json({ message: 'Server error while deleting profile.' });
    }
};

export {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};