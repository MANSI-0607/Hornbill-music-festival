import { Router } from 'express';
import { listMerch, createMerch, updateMerch, deleteMerch, requireAdmin, createCartSession, getCartSession } from '../controllers/merchController.js';
import { uploadMerch } from '../middleware/upload.js';

const router = Router();

// Public
router.get('/', listMerch);

router.post('/upload-image', requireAdmin, uploadMerch.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const file = req.file;
    const url = file.path || file.secure_url || file.url;
    if (!url) {
      return res.status(500).json({ message: 'Upload succeeded but no URL returned' });
    }
    return res.status(200).json({ url, public_id: file.filename || file.public_id || null });
  } catch (err) {
    console.error('Upload error:', err?.message || err, err?.stack || '');
    return res.status(500).json({ message: 'Upload failed', error: err?.message || 'Unknown error' });
  }
});

// Admin protected CRUD
router.post('/', requireAdmin, createMerch);
router.put('/:id', requireAdmin, updateMerch);
router.delete('/:id', requireAdmin, deleteMerch);

router.post("/cart/session", createCartSession);
router.get('/cart/session/:sessionId', getCartSession);
export default router;