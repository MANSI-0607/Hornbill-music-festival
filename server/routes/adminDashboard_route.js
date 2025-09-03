import express from "express";
import { verifyAdminToken } from "../middleware/adminAuth.js";
import {
  getAllBands,
  verifyBandStatus
} from "../controllers/adminDashboard_controller.js";

const router = express.Router();

// GET all registered bands
router.get("/bands",  getAllBands);

// PATCH to verify or reject a band
router.patch("/bands/:id/status", verifyBandStatus);

export default router;
