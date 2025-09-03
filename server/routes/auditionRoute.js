import { Router } from 'express';
import upload from '../middleware/upload.js';
import { submitAudition } from '../controllers/auditionController.js';

const router = Router();

// Single image upload (field name = "image")
console.log("routes")
router.post('/auditions', upload.single('bandPhoto'), submitAudition);

export default router;
