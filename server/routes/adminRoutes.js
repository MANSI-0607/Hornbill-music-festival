// routes/adminRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyAdminToken } from "../middleware/adminAuth.js";
import BandUser from "../models/BandUser.js";

dotenv.config();
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email: process.env.ADMIN_EMAIL, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// GET all auditions
router.get("/auditions", verifyAdminToken, async (req, res) => {
  try {
    const auditions = await BandUser.find().sort({ createdAt: -1 });
    return res.json(auditions);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE single audition
router.delete("/auditions/:id", verifyAdminToken, async (req, res) => {
  try {
    await BandUser.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE bulk auditions
router.delete("/auditions", verifyAdminToken, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ message: "No IDs provided" });
    await BandUser.deleteMany({ _id: { $in: ids } });
    return res.json({ message: `Deleted ${ids.length} records` });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH update audition status
router.patch("/auditions/:id/status", verifyAdminToken, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await BandUser.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
