import multer from "multer";
import BrandModel from "../models/brand.model.js";
import CategoryModel from "../models/category.model.js"; // Import CategoryModel to validate category IDs
import path from "path";
import slugify from "slugify";

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "./uploads");
  },
  filename: function (req, file, cd) {
    cd(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });
const uploadSingleFile = upload.single("logo");

const addBrand = async (req, res) => {
  const { name, categoryIds } = req.body; // Accept categoryIds from request body
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Validate that categoryIds are provided
    if (!categoryIds || categoryIds.length === 0) {
      return res.status(400).json({
        message: "Category IDs are required.",
      });
    }

    // Split the categoryIds and validate each one exists in the database
    const categoryArray = categoryIds.split(",");
    const validCategories = await CategoryModel.find({
      _id: { $in: categoryArray },
    });

    // Check if the number of valid categories matches the number of provided IDs
    if (validCategories.length !== categoryArray.length) {
      return res.status(400).json({
        message: "One or more invalid category IDs.",
      });
    }

    // Create a new Brand with validated categories
    const Brand = new BrandModel({
      name,
      logo: imagePath,
      categories: categoryArray,
    });

    const savedBrand = await Brand.save();
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
    const brands = await BrandModel.find().populate("categories", "name slug");

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

export { getAllBrands, addBrand, uploadSingleFile };
