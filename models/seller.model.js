import { Schema, model } from "mongoose";
import addressModel from "./address.model.js";
const sellerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "seller" },
  status: { type: String, default: "pending" },
  phone: { type: String, required: true },

  businessInfo: {
    companyName: { type: String },
    registrationNumber: { type: String },
    taxId: { type: String },
  },

  // Make address optional
  address: { type: Schema.Types.ObjectId, ref: "Address", required: false },

  bankDetails: {
    accountHolderName: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    routingNumber: { type: String },
    swiftCode: { type: String },
  },

  payoutHistory: [
    {
      payoutId: { type: String },
      amount: { type: Number },
      status: { type: String },
      createdAt: { type: Date },
      completedAt: { type: Date },
    },
  ],
  activeAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

sellerSchema.set("timestamps", true);

// After defining the sellerSchema...

sellerSchema.post("findOneAndDelete", async function (doc) {
  if (doc?.address) {
    await addressModel.findByIdAndDelete(doc.address);
  }
});

const SellerModel = model("Seller", sellerSchema);

export default SellerModel;
