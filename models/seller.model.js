import { Schema, model } from "mongoose";

const sellerSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "seller" },
  status: { type: String, default: "active" },
  phone: { type: String },

  businessInfo: {
    companyName: { type: String },
    registrationNumber: { type: String },
    taxId: { type: String },
  },

  address: { type: Schema.Types.ObjectId, ref: "Address" },

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

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Enable timestamps for automatic creation and update of `createdAt` and `updatedAt`
sellerSchema.set("timestamps", true);

const SellerModel = model("Seller", sellerSchema);

export default SellerModel;
