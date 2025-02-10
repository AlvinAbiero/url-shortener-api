import Url from "../models/Url.js";
import { nanoid } from "nanoid";

// Create a new short URL
export const createShortUrl = async (req, res) => {
  const { url } = req.body;
  if (!url)
    return res.status(400).json({
      success: false,
      error: "URL is required",
    });

  try {
    const shortCode = nanoid(8);
    const newUrl = await Url.create({
      url,
      shortCode,
      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      data: newUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Retrieve the original URL
export const getOriginalUrl = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const urlEntry = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { accessCount: 1 } },
      { new: true }
    );

    if (!urlEntry)
      return res.status(404).json({
        success: false,
        error: "Short URL not found",
      });
    res.status(200).json({
      success: true,
      data: urlEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update an existing short URL
export const updateShorturl = async (req, res) => {
  const { shortCode } = req.params;
  const { url } = req.body;

  if (!url)
    return res.status(400).json({
      success: false,
      error: "New URL is required",
    });

  try {
    const updatedUrl = await Url.findOneAndUpdate(
      { shortCode },
      { url, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedUrl) {
      return res.status(404).json({
        success: false,
        error: "URL not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUrl,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete short URL
export const deleteShortUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOneAndDelete({ shortCode });

    if (!url) {
      return res.status(404).json({
        success: false,
        error: "Url not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

// Get URL statitstics
export const getUrlStats = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOne({ shortCode });
    if (!url)
      return res.status(404).json({
        success: false,
        error: "Short URL not found",
      });

    res.status(200).json({
      success: true,
      data: url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
