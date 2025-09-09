import NotificationEmail from '../models/NotificationEmail.js';

export const subscribeEmail = async (req, res) => {
  try {
    const { email, source = 'schedule' } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Basic email format check
    const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Upsert to avoid duplicates
    const doc = await NotificationEmail.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $setOnInsert: { email: email.toLowerCase().trim(), source } },
      { new: true, upsert: true }
    );

    return res.status(201).json({ message: 'Subscribed successfully', id: doc._id });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(409).json({ message: 'Email already subscribed' });
    }
    console.error('Subscribe email error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
