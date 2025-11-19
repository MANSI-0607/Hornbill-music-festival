import mongoose from "mongoose";

const CartSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "MerchItem", required: true },
        quantity: { type: Number, default: 1 }
      }
    ],
    createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto delete in 1 hour
  }
);

export default mongoose.model("CartSession", CartSessionSchema);
