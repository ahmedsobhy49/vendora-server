import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Automatically set createdAt and updatedAt timestamps
cartSchema.set("timestamps", true);

const cartModel = model("Cart", cartSchema);

export default cartModel;
