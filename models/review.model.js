// Review.js
import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Automatically set createdAt and updatedAt timestamps
reviewSchema.set("timestamps", true);

const reviewModel = model("Review", reviewSchema);

export default reviewModel;
