import mongoose from 'mongoose';

const NotificationEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    source: {
      type: String,
      default: 'schedule',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a unique index on email if not already ensured
NotificationEmailSchema.index({ email: 1 }, { unique: true });

const NotificationEmail = mongoose.model('NotificationEmail', NotificationEmailSchema);
export default NotificationEmail;
