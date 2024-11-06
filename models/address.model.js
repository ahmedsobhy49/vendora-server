import { Schema, model } from "mongoose";
import SellerModel from "./seller.model.js";
import userModel from "./user.model.js";

const addressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "userType", // Reference to the user type (User or Seller)
  },
  userType: {
    type: String,
    enum: ["User", "Seller"],
  },

  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  buildingNumber: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to automatically set userType
addressSchema.pre("save", async function (next) {
  if (!this.userType) {
    const isUser = await userModel.exists({ _id: this.userId });
    if (isUser) {
      this.userType = "User";
    } else {
      const isSeller = await SellerModel.exists({ _id: this.userId });
      if (isSeller) {
        this.userType = "Seller";
      } else {
        return next(
          new Error("Invalid userId: No matching user or seller found.")
        );
      }
    }
  }
  next();
});

addressSchema.set("timestamps", true);

const addressModel = model("Address", addressSchema);

export default addressModel;
