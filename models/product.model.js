import { Schema, model } from "mongoose";
import CategoryModel from "./category.model.js";
const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  productImages: [
    {
      url: { type: String, required: true }, // Assuming this is the structure
      altText: { type: String, required: false }, // Optional
    },
  ],
  brand: {
    _id: { type: Schema.Types.ObjectId, ref: "Brand" },
    name: { type: String },
    logo: { type: String },
  },

  brandName: {
    type: String,
    required: function () {
      return !this.brand;
    },
  },

  discount: {
    amount: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
  },

  seller: {
    _id: { type: Schema.Types.ObjectId, ref: "Seller" },
    name: { type: String },
  },

  category: {
    _id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true },
  },
  subCategory: {
    _id: { type: Schema.Types.ObjectId, ref: "Category" },
    name: { type: String },
  },
  subSubCategory: {
    _id: { type: Schema.Types.ObjectId, ref: "Category" },
    name: { type: String },
  },

  tags: [{ type: String }],
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  ratings: {
    averageRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  shipping: {
    freeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0 },
    handlingTime: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  categorySpecificFields: {
    type: Schema.Types.Mixed,
    required: false,
  },
  sku: { type: String, unique: true },
});

// Sub-schemas for category-specific fields
const phoneSchema = new Schema({
  screenSize: { type: String, required: true },
  variations: [
    {
      storage: { type: String, required: true },
      ram: { type: String, required: true },
      colors: [
        {
          color: { type: String, required: true },
          stock: { type: Number, required: true, min: 0 },
        },
      ],
    },
  ],
});

const clothingSchema = new Schema({
  variations: [
    {
      size: { type: String, required: true },
      options: [
        {
          color: { type: String, required: true },
          stock: { type: Number, required: true, min: 0 },
        },
      ],
    },
  ],
});

// Helper function to get schema by category
const getSubCategorySpecificFields = (subCategoryName) => {
  switch (subCategoryName) {
    case "smart phones":
    case "tablets":
    case "ipads":
      return phoneSchema; // Ensure this is a valid schema
    case "clothing":
    case "tops":
    case "bottoms":
    case "dresses":
      return clothingSchema; // Ensure this is a valid schema
    default:
      return null; // Handle unknown categories
  }
};

// Helper function to generate SKU
const generateSKU = (product) => {
  const categoryPrefix = product.category.substring(0, 3).toUpperCase(); // Example prefix
  const timestamp = Date.now().toString(); // Unique part
  const randomNumber = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0"); // Random number for uniqueness
  return `${categoryPrefix}-${timestamp}-${randomNumber}`; // Example SKU format
};

function getCategoryCode(category) {
  const categoryCodes = {
    "smart phones": "PH",
    tablets: "TB",
    clothing: "CL",
    // Add more categories as needed
  };
  return categoryCodes[category] || "OT"; // "OT" for others
}

// Pre-save middleware
productSchema.pre("save", async function (next) {
  try {
    // Automatically generate SKU if it's not set
    if (!this.sku) {
      this.sku = `SKU-${this._id}`; // Example of generating SKU. You might want to implement a more robust SKU generation.
    }

    const category = await CategoryModel.findById(this.subCategory);
    console.log("Retrieved category:", category); // Log the retrieved category for debugging

    if (!category) {
      throw new Error("Category not found");
    }

    const schema = getSubCategorySpecificFields(category.name);
    if (schema) {
      console.log("Using schema for category:", schema); // Log the schema being used
      // Assign the category-specific fields if they exist
      this.categorySpecificFields = this.categorySpecificFields || {}; // Ensure it matches the expected structure
    } else {
      console.warn("No schema found for category:", category.name);
    }

    next(); // Call next only once after all operations
  } catch (error) {
    console.error("Error in pre-save middleware:", error);
    next(error); // Pass error to the next middleware
  }
});

// Compile the model from the schema
const ProductModel = model("Product", productSchema);

export default ProductModel;
