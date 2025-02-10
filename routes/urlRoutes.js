import express from "express";
import {
  createShortUrl,
  getOriginalUrl,
  updateShorturl,
  deleteShortUrl,
  getUrlStats,
} from "../controllers/urlController.js";
import validateUrl from "../middleware/validateUrl.js";
import { protect } from "../middleware/auth.js";
import { limiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(limiter);

router.use(protect);

router.post("/shorten", validateUrl, createShortUrl);
router.get("/shorten/:shortCode", getOriginalUrl);
router.put(
  "/shorten/:shortCode",
  protect,
  limiter,
  validateUrl,
  updateShorturl
);
router.delete("/shorten/:shortCode", deleteShortUrl);
router.get("/shorten/:shortCode/stats", getUrlStats);

export default router;
