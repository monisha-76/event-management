import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User (Minor adjustment: exclude password from response)
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        
        // Prepare user data for response, excluding the password
        const { password: _, ...userData } = user._doc;

        return res.status(201).json({
            message: "Registered successfully",
            user: userData, // Send non-sensitive user data
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Login User (Enhanced for HttpOnly Cookie)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            // Use a generic message for both password/user errors for better security
            return res.status(400).json({ message: "Invalid credentials" }); 

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // --- CRITICAL SECURITY STEP: Set HttpOnly Cookie ---
        res.cookie("token", token, {
            httpOnly: true, // Prevents client-side JavaScript access (XSS mitigation)
            secure: process.env.NODE_ENV === "production", // Use only over HTTPS in production
            sameSite: "none", // Protection against CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (in milliseconds)
            path: "/", // Token valid for all paths
        });
        // --------------------------------------------------

        // Prepare user data for response, excluding the password
        const { password: _, ...userData } = user._doc;

        // The cookie is set via the HTTP header. Send user data in the body.
        return res.json({
            message: "Login successful",
            user: userData,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
// controllers/authController.js

// ... existing imports and register, login functions ...

export const logout = (req, res) => {
    // Explanation: Clear the 'token' cookie by setting it to an empty value 
    // and setting its expiration date to the past (Date(0)).
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        expires: new Date(0),
        path: "/",
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// GET LOGGED-IN USER DETAILS
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update name
    if (name) user.name = name;

    // Update email
    if (email) user.email = email.toLowerCase();

    // Update password only if provided
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const responseUser = user.toObject();
    delete responseUser.password;

    res.json({
      message: "Profile updated successfully",
      user: responseUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};