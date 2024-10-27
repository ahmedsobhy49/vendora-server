import multer from "multer";
import BrandModel from "../models/brand.model.js";
import CategoryModel from "../models/category.model.js"; // Import CategoryModel to validate category IDs
import path from "path";

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });
const uploadSingleFile = upload.single("logo");

const addBrand = async (req, res) => {
  const { name, categoryId } = req.body; // Accept single categoryId from request body
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Validate that categoryId is provided
    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required.",
      });
    }

    // Check if the categoryId exists in the database
    const validCategory = await CategoryModel.findById(categoryId);

    if (!validCategory) {
      return res.status(400).json({
        message: "Invalid category ID.",
      });
    }

    // Create a new Brand with the validated category
    const brand = new BrandModel({
      name,
      logo: imagePath,
      category: categoryId, // Save the single categoryId
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

// Method for getting all brands along with their category
const getAllBrands = async (req, res) => {
  try {
    // Retrieve all brands and populate their associated category
    const brands = await BrandModel.find().populate("category", "name slug");

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

const getBrandsByCategoryId = async (req, res) => {
  const { categoryId } = req.params; // Get the category ID from the request params

  try {
    // Find brands that have the specified category ID
    const brands = await BrandModel.find({ category: categoryId });

    // Check if any brands were found
    if (brands.length === 0) {
      return res.status(404).json({
        message: "No brands found for the specified category ID",
      });
    }

    // Return the found brands
    return res.status(200).json({
      message: "Brands retrieved successfully",
      brands,
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      message: "Error retrieving brands",
      error: error.message,
    });
  }
};

export { getAllBrands, addBrand, uploadSingleFile, getBrandsByCategoryId };
