// User.js
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: "user" },

  // Reference to addresses
  address: { type: Schema.Types.ObjectId, ref: "Address", required: false },

  // Reference to cart
  cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: false },

  // Reference to wishlist
  wishlistId: { type: Schema.Types.ObjectId, ref: "Wishlist", required: false },

  // Reference to orders
  orders: [{ type: Schema.Types.ObjectId, ref: "Order", required: false }], // Add this line

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Automatically set createdAt and updatedAt timestamps
userSchema.set("timestamps", true);

const userModel = model("User", userSchema);

export default userModel;
