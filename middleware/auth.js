import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({
      success: false,
      error: "Unauthorized, no token",
    });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded // Find user by ID from token
    if (!req.user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Invalid token.",
    });
  }
};
