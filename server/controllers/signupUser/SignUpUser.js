import User from "../../models/UserSchema.js";
import sendOTPEmail from "../../config/NodeMailer.js";

const tempUserStore = {};

const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }

    // Check if a verified user with this email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists." });
    }

    // Check username availability
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: "This username is already taken." });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store user data (with plain password) and OTP temporarily.
    // The password will be hashed by the Mongoose pre-save hook ONLY when we create the user.
    tempUserStore[email] = {
      username,
      email,
      password, // Storing plain password temporarily
      otp,
      expires: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
    };

    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: `OTP has been sent to ${email}. Please verify to complete your registration.`,
    });
  } catch (error) {
    console.error("Signup Request Error:", error);
    if (error.message === "Could not send OTP email.") {
      return res
        .status(500)
        .json({
          message:
            "Failed to send OTP email. Please ensure server email credentials are correct.",
        });
    }
    res.status(500).json({ message: "Server error during signup request." });
  }
};

const verifyOtpAndCreateUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Please provide both email and OTP." });
    }

    const tempUser = tempUserStore[email];

    if (!tempUser || Date.now() > tempUser.expires) {
      if (tempUser) delete tempUserStore[email]; // Clean up expired entry
      return res
        .status(400)
        .json({
          message: "OTP is invalid or has expired. Please sign up again.",
        });
    }

    // Check if the submitted OTP matches the stored OTP
    if (tempUser.otp !== otp) {
      return res
        .status(400)
        .json({ message: "The OTP you entered is incorrect." });
    }
    const user = await User.create({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      role: "User",
    });

    // IMPORTANT: Clean up the temporary store immediately after use
    delete tempUserStore[email];

    if (user) {
      res
        .status(201)
        .json({
          message:
            "Account verified and created successfully! You can now log in.",
        });
    } else {
      res
        .status(400)
        .json({ message: "Failed to create user. Invalid data provided." });
    }
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res
      .status(500)
      .json({ message: "Server error during account verification." });
  }
};

export { signupUser, verifyOtpAndCreateUser };
