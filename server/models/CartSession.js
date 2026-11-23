import mongoose from "mongoose";

const CartSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "MerchItem", required: true },
        itemId: { type: String, default: "" },
        productCode: { type: String, default: "" },
        sku: { type: String, default: "" }, // e.g. "HBF-RNT-LILY-NAVY-L"
        name: { type: String, required: true },
        design: { type: String, default: "" },
        colour: { type: String, default: "" },
        size: { type: String, default: "" },
        variant: { type: String, default: "" }, // e.g. "Kisama Lily · Navy · Size: L"
        packOption: { type: String, default: "" }, // e.g. "Single" or "Pack of 10"
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
        image: { type: String, default: "" },
      }
    ],
    totalAmount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    createdAt: { type: Date, default: Date.now, expires: 7200 } // Auto delete in 2 hours
  }
);

export default mongoose.model("CartSession", CartSessionSchema);
