import multer from "multer";
import BrandModel from "../models/brand.model.js";
import CategoryModel from "../models/category.model.js"; // Import CategoryModel to validate category IDs
import path from "path";
import fs from "fs";

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });
const uploadSingleFile = upload.single("logo");

const addBrand = async (req, res) => {
  const { name, categoryIds } = req.body; // Accept an array of categoryIds from the request body
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Validate that categoryIds are provided
    if (
      !categoryIds ||
      !Array.isArray(categoryIds) ||
      categoryIds.length === 0
    ) {
      return res.status(400).json({
        message: "At least one category ID is required.",
      });
    }

    // Validate all categoryIds
    const validCategories = await CategoryModel.find({
      _id: { $in: categoryIds },
    });

    if (validCategories.length !== categoryIds.length) {
      return res.status(400).json({
        message: "One or more invalid category IDs.",
      });
    }

    // Create a new Brand with the validated categories
    const brand = new BrandModel({
      name,
      logo: imagePath,
      categories: categoryIds, // Save the array of categoryIds
    });

    const savedBrand = await brand.save();
    return res.status(201).json({
      message: "Brand created successfully",
      brand: savedBrand,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating brand",
      error: error.message,
    });
  }
};

// Method for getting all brands along with their categories
const getAllBrands = async (req, res) => {
  try {
    // Retrieve all brands and populate their associated categories
    const brands = await BrandModel.find().populate("categories", "name");

    return res.status(200).json({
      message: "Brands retrieved successfully",
      brands,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving brands",
      error: error.message,
    });
  }
};

// Method for getting a brand by ID, populated with categories
const getBrandById = async (req, res) => {
  const { brandId } = req.params; // Get the brand ID from the request params

  try {
    // Find the brand by its ID and populate its categories
    const brand = await BrandModel.findById(brandId).populate(
      "categories",
      "name"
    );

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    return res.status(200).json({
      message: "Brand retrieved successfully",
      brand,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving brand",
      error: error.message,
    });
  }
};

// Method for getting brands by categoryId
const getBrandsByCategoryId = async (req, res) => {
  const { categoryId } = req.params; // Get the category ID from the request params

  try {
    // Find brands that have the specified category ID in the categories array
    const brands = await BrandModel.find({ categories: categoryId }).populate(
      "categories",
      "name"
    );

    // Check if any brands were found
    if (brands.length === 0) {
      return res.status(404).json({
        message: "No brands found for the specified category ID",
      });
    }

    return res.status(200).json({
      message: "Brands retrieved successfully",
      brands,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving brands",
      error: error.message,
    });
  }
};

// Delete brand by ID and remove associated image
const deleteBrandById = async (req, res) => {
  const { brandId } = req.params;
  try {
    // Find the brand by ID
    const brand = await BrandModel.findById(brandId);
    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    // Delete the image file if it exists
    if (brand.logo) {
      const imagePath = path.join(process.cwd(), brand.logo); // Build absolute path from project root
      console.log("Deleting Image:", imagePath); // Log the image path for debugging

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image file
        console.log("Image deleted successfully.");
      } else {
        console.log("Image file not found at path:", imagePath);
      }
    }

    // Delete the brand from the database
    await BrandModel.findByIdAndDelete(brandId);

    return res.status(200).json({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting brand",
      error: error.message,
    });
  }
};

export {
  getAllBrands,
  addBrand,
  uploadSingleFile,
  getBrandsByCategoryId,
  deleteBrandById,
  getBrandById,
};
