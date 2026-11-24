import mongoose from 'mongoose';

const VariantImageSchema = new mongoose.Schema(
  {
    design: { type: String, default: '', trim: true }, // e.g. "Kisama Lily"
    colour: { type: String, default: '', trim: true }, // e.g. "Navy"
    imageUrl: { type: String, default: '', trim: true },
    images: { type: [String], default: [] },
  },
  { _id: false }
);

const MerchItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    productCode: { type: String, default: '', trim: true }, // e.g. "HBF-RNT", "HBF-OST"
    category: {
      type: String,
      enum: ['T-Shirts', 'Winterwear', 'Accessories', 'General'],
      default: 'T-Shirts',
    },
    description: { type: String, default: '', trim: true },

    // Fabric & Product Specifications
    fabric: { type: String, default: '', trim: true }, // e.g. "100% cotton, bio-washed"
    weight: { type: String, default: '', trim: true }, // e.g. "180 GSM", "320 GSM"
    fit: { type: String, default: '', trim: true }, // e.g. "Regular, round neck", "Oversized, drop shoulder"

    // Primary Pricing (Single item)
    price: { type: Number, required: true, min: 0 },

    // Pack / Bundle Pricing (e.g. for badges and stickers pack of 10)
    hasPackOption: { type: Boolean, default: false },
    packPrice: { type: Number, default: 0, min: 0 },
    packLabel: { type: String, default: 'Pack of 10', trim: true },

    // Variant Options: Designs
    designs: [
      {
        name: { type: String, required: true, trim: true }, // e.g. "Kisama Lily"
        code: { type: String, default: '', trim: true }, // e.g. "LILY"
      },
    ],

    // Variant Options: Colours
    colours: [
      {
        name: { type: String, required: true, trim: true }, // e.g. "Navy", "Black"
        hex: { type: String, default: '#000000', trim: true }, // e.g. "#1B2A4A"
      },
    ],

    // Available sizes (e.g. ['S', 'M', 'L', 'XL', 'XXL'])
    sizes: {
      type: [String],
      default: [],
    },

    // Size chart image URL
    sizeChartUrl: {
      type: String,
      default: '',
      trim: true,
    },

    // Photos & Media (No artificial limit - show all images)
    imageUrl: { type: String, default: '', trim: true },
    images: {
      type: [String],
      default: [],
    },

    // Combination-specific Images for (Design + Colour)
    variantImages: [VariantImageSchema],

    stock: { type: Number, default: 100, min: 0 },
    position: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MerchItem = mongoose.model('MerchItem', MerchItemSchema);
export default MerchItem;
