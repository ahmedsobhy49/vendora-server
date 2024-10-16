// Product.js
import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
  brandName: { type: String },
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  discount: {
    amount: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  images: [
    {
      url: { type: String, required: true },
      altText: { type: String, required: true },
    },
  ],
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  stock: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  ratings: {
    averageRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  reviews: [
    {
      reviewId: { type: Schema.Types.ObjectId, ref: "Review" },
    },
  ],
  tags: [{ type: String }],
  sku: { type: String, required: true, unique: true },
  variations: [
    {
      colors: [{ type: String }],
      sizes: [{ type: String }],
      stock: {
        type: Map,
        of: Number,
      },
    },
  ],
  shipping: {
    freeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0 },
    handlingTime: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

productSchema.set("timestamps", true);

const Product = model("Product", productSchema);

export default Product;
