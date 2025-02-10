import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, httpOnly: true }, // Secure should be true in production with HTTPS
  })
);

app.use("/api/auth", authRoutes);
app.use("/api", urlRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

export default app;
