import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema(
  {
    desktop: { type: String, required: true },
    mobile: { type: String, required: true },
    alt: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

heroImageSchema.index({ order: 1 });

const HeroImage = mongoose.model('HeroImage', heroImageSchema);
export default HeroImage;
