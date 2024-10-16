// Order.js
import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
});

orderSchema.set("timestamps", true);

const orderModel = model("Order", orderSchema);

export default orderModel;
