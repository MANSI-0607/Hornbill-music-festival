import mongoose from 'mongoose';

const MerchItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    // Deprecated single image, kept for backward compatibility
    imageUrl: { type: String, default: '', trim: true },
    // New: up to 3 images, first is primary
    images: {
      type: [String],
      default: [],
      validate: [
        (arr) => Array.isArray(arr) && arr.length <= 3,
        'A maximum of 3 images is allowed',
      ],
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MerchItem = mongoose.model('MerchItem', MerchItemSchema);
export default MerchItem;
