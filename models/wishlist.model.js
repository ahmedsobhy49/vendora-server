// Wishlist.js
import { Schema, model } from "mongoose";

const wishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Automatically set createdAt and updatedAt timestamps
wishlistSchema.set("timestamps", true);

const wishlistModel = model("Wishlist", wishlistSchema);

export default wishlistModel;
