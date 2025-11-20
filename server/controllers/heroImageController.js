import HeroImage from "../models/heroImageModel.js";

// ----------------------------------------
// UPLOAD HERO IMAGE (desktop or mobile)
// ----------------------------------------
export const uploadHeroImage = async (req, res) => {
  try {
    console.log("Hero upload controller hit");

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // multer-cloudinary already uploads, so Cloudinary URL is here:
    const imageUrl = req.file.path;

    return res.status(200).json({ url: imageUrl });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// ----------------------------------------
// ADD HERO IMAGE (desktop + mobile)
// ----------------------------------------
export const addHeroImage = async (req, res) => {
  try {
    const { desktop, mobile, alt } = req.body;

    if (!desktop || !mobile) {
      return res.status(400).json({ message: "Both desktop & mobile images required" });
    }

    const count = await HeroImage.countDocuments();

    const created = await HeroImage.create({
      desktop,
      mobile,
      alt,
      order: count,
    });

    return res.status(201).json(created);

  } catch (error) {
    console.error("Add hero image error:", error);
    return res.status(500).json({ message: "Error adding hero image", error: error.message });
  }
};

// ----------------------------------------
// GET HERO IMAGES
// ----------------------------------------
export const getHeroImages = async (req, res) => {
  try {
    const images = await HeroImage.find().sort({ order: 1 });
    return res.status(200).json(images);
  } catch (error) {
    console.error("Get hero images error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// UPDATE ORDER
// ----------------------------------------
export const updateImageOrder = async (req, res) => {
  try {
    const { order } = req.body;

    const updated = await HeroImage.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true }
    );

    return res.status(200).json(updated);

  } catch (error) {
    console.error("Order update error:", error);
    return res.status(500).json({ message: "Error updating order" });
  }
};

// ----------------------------------------
// DELETE HERO IMAGE
// ----------------------------------------
export const deleteHeroImage = async (req, res) => {
  try {
    const deleted = await HeroImage.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Image not found" });
    }

    await HeroImage.updateMany(
      { order: { $gt: deleted.order } },
      { $inc: { order: -1 } }
    );

    return res.status(200).json({ message: "Image deleted successfully" });

  } catch (error) {
    console.error("Delete hero error:", error);
    return res.status(500).json({ message: "Error deleting hero image" });
  }
};
