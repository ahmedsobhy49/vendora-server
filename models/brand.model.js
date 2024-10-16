import { Schema, model } from "mongoose";

const brandSchema = new Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category", // Reference to the Category model
      required: true,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

brandSchema.set("timestamps", true);

const BrandModel = model("Brand", brandSchema);

export default BrandModel;
