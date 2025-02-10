const validateUrl = (req, res, next) => {
  try {
    const { url } = req.body;

    const urlObject = new URL(url);
    if (urlObject.protocol === "http:" || urlObject.protocol === "https:") {
      next();
    } else {
      throw new Error("Invalid URL protocol");
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Invalide URL format",
    });
  }
};

export default validateUrl;
