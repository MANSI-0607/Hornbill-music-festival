import { Router } from 'express';
import upload from '../middleware/upload.js';
import { submitAudition } from '../controllers/auditionController.js';

const router = Router();

// Single image upload (field name = "image")
console.log("routes")
router.post('/auditions', upload.single('bandPhoto'), submitAudition);

// Instant band photo upload endpoint
router.post('/auditions/upload-band-photo', upload.single('bandPhoto'), (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    return res.status(200).json({
      url: req.file.path,
      public_id: req.file.filename || null,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

export default router;
