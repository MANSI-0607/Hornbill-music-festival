import MerchItem from '../models/MerchItem.js';
import jwt from 'jsonwebtoken';

// Simple admin token check (uses the same admin token as /api/admin/login)
export const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const listMerch = async (req, res) => {
  try {
    const items = await MerchItem.find({ isActive: true }).sort({ createdAt: -1 });
    // Ensure consumers always have an images array
    const normalized = items.map((i) => {
      const doc = i.toObject();
      if ((!doc.images || doc.images.length === 0) && doc.imageUrl) {
        doc.images = [doc.imageUrl];
      }
      return doc;
    });
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch merchandise' });
  }
};

export const createMerch = async (req, res) => {
  try {
    const { name, description = '', imageUrl = '', images = [], price, stock = 0, isActive = true } = req.body || {};
    if (!name || typeof price !== 'number') {
      return res.status(400).json({ message: 'Name and numeric price are required' });
    }
    // Normalize images: prefer images array; if not provided but imageUrl exists, seed array with it
    let imagesArr = Array.isArray(images) ? images.filter(Boolean) : [];
    if (imagesArr.length === 0 && imageUrl) imagesArr = [imageUrl];
    if (imagesArr.length > 3) imagesArr = imagesArr.slice(0, 3);

    const created = await MerchItem.create({ name, description, imageUrl, images: imagesArr, price, stock, isActive });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create item' });
  }
};

export const updateMerch = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body || {};
    if (update.images && Array.isArray(update.images)) {
      update.images = update.images.filter(Boolean).slice(0, 3);
    }
    const updated = await MerchItem.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item' });
  }
};

export const deleteMerch = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MerchItem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
};
