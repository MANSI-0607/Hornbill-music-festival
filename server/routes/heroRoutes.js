import express from "express";
import { uploadHero } from "../middleware/upload.js";
import {
  uploadHeroImage,
  addHeroImage,
  getHeroImages,
  updateImageOrder,
  deleteHeroImage
} from "../controllers/heroImageController.js";

const router = express.Router();

router.post("/upload", uploadHero.single("heroImage"), uploadHeroImage);

router.get("/", getHeroImages);
router.post("/", addHeroImage);
router.put("/:id/order", updateImageOrder);
router.delete("/:id", deleteHeroImage);

export default router;
