// User.js
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: "user" },

  // Reference to addresses
  addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],

  // Reference to cart
  cartId: { type: Schema.Types.ObjectId, ref: "Cart" },

  // Reference to wishlist
  wishlistId: { type: Schema.Types.ObjectId, ref: "Wishlist" },

  // Reference to orders
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }], // Add this line

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Automatically set createdAt and updatedAt timestamps
userSchema.set("timestamps", true);

const userModel = model("User", userSchema);

export default userModel;
