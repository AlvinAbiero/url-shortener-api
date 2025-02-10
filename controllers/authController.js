import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register a new user
export const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already exists.",
      });
    }

    const user = await User.create({ email, password });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

//  Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);
    req.session.user = user._id; // Store user ID in session
    user.sessions.push({ token });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
};
