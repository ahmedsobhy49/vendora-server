import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: "user" },

  // Multiple addresses for flexibility
  addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],

  // Reference to cart, wishlist, and orders
  cartId: { type: Schema.Types.ObjectId, ref: "Cart" },
  wishlistId: { type: Schema.Types.ObjectId, ref: "Wishlist" },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],

  // Status and activity tracking
  status: { type: String, default: "active" },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },

  // Verification and reset tokens
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },

  // Preferences and notifications
  notificationPreferences: { type: Map, of: Boolean },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Automatically set createdAt and updatedAt timestamps
userSchema.set("timestamps", true);

const userModel = model("User", userSchema);

export default userModel;
