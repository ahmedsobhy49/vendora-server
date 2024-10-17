import { Schema, model } from "mongoose";

// Base Product Schema
const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
  brandName: { type: String },
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  categoryIds: [
    { type: Schema.Types.ObjectId, ref: "Category", required: true },
  ],
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
  shipping: {
    freeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0 },
    handlingTime: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

productSchema.set("timestamps", true);

// Create the base Product model
const Product = model("Product", productSchema);

// Clothing Product Schema (extends the base Product schema)
const clothingProductSchema = new Schema({
  variations: [
    {
      size: { type: String, required: true }, // Each variation has a size
      colors: [{ type: String, required: true }], // Each variation has an array of colors
      stock: { type: Number, required: true, min: 0 }, // Stock is a number and required
    },
  ],
  gender: {
    type: String,
    enum: ["male", "female", "unisex"],
    required: true, // Only required for clothing
  },
});

// Use discriminators to create a ClothingProduct model
const ClothingProduct = Product.discriminator(
  "ClothingProduct",
  clothingProductSchema
);

export { Product, ClothingProduct };
