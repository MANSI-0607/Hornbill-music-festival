import mongoose from 'mongoose';

const CategoryShowcaseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      enum: ['T-Shirts', 'Winterwear', 'Accessories', 'General'],
      trim: true,
    },
    title: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    images: {
      type: [String],
      default: [], // At least 3 images for each category
    },
  },
  { timestamps: true }
);

const CategoryShowcase = mongoose.model('CategoryShowcase', CategoryShowcaseSchema);
export default CategoryShowcase;
