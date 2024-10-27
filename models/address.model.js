import { Schema, model } from "mongoose";

const addressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "userType", // Reference to the user type (User or Seller)
  },
  userType: {
    type: String,
    enum: ["User", "Seller"],
    required: true,
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

addressSchema.set("timestamps", true);

const addressModel = model("Address", addressSchema);

export default addressModel;
