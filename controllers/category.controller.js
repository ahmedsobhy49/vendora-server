import multer from "multer";
import CategoryModel from "../models/category.model.js";
import path from "path";
import slugify from "slugify";
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
const uploadSingleFile = upload.single("image");

const addCategory = async (req, res) => {
  const { name, parentCategoryId } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  // Generate the slug from the category name
  const slug = slugify(name, { lower: true, strict: true });

  const Category = new CategoryModel({
    name,
    parentCategoryId,
    image: imagePath,
    slug,
  });

  try {
    const savedCategory = await Category.save();
    return res.status(201).json({
      message: "category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating category",
      error: error.message,
    });
  }
};

// Method for getting all parent categories
const getAllParentCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ parentCategoryId: null }); // Retrieve all categories

    return res.status(200).json({
      message: "Parent categories retrieved successfully",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving parent categories",
      error: error.message,
    });
  }
};

// Method for getting categories by parent category ID
const getCategoriesByParentId = async (req, res) => {
  const { parentCategoryId } = req.params;

  try {
    // Retrieve all categories with the specified parentCategoryId
    const categories = await CategoryModel.find({ parentCategoryId });

    // Fetch subcategories for each of the categories retrieved
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await CategoryModel.find({
          parentCategoryId: category._id,
        });
        return {
          ...category.toObject(),
          subcategories,
        };
      })
    );

    return res.status(200).json({
      message: "Categories retrieved successfully",
      categories: categoriesWithSubcategories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving categories",
      error: error.message,
    });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({
      parentCategoryId: { $ne: null },
    }); // Retrieve all categories where parentCategoryId is not null

    return res.status(200).json({
      message: "subcategories retrieved successfully",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving subcategories",
      error: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({});

    return res.status(200).json({
      message: "categories retrieved successfully",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving  categories",
      error: error.message,
    });
  }
};

const getFirstTwoLevelsOfCategories = async (req, res) => {
  try {
    // Fetch all parent categories (categories with no parentCategoryId)
    const parentCategories = await CategoryModel.find({
      parentCategoryId: null,
    });

    // For each parent category, fetch its immediate subcategories (first-level children)
    const categoriesWithSubcategories = await Promise.all(
      parentCategories.map(async (parentCategory) => {
        // Fetch first-level subcategories for the current parent category
        const subcategories = await CategoryModel.find({
          parentCategoryId: parentCategory._id,
        });

        // Return the parent category along with its subcategories
        return {
          ...parentCategory.toObject(),
          subcategories: subcategories.map((sub) => ({
            _id: sub._id,
            name: sub.name,
            slug: sub.slug,
            image: sub.image, // Include image if you want
          })),
        };
      })
    );

    return res.status(200).json({
      message: "First two levels of categories retrieved successfully",
      categories: categoriesWithSubcategories, // This now includes both parent and their subcategories
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving categories",
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category retrieved successfully",
      category,
    });
  } catch (error) {
    console.error("Error retrieving category:", error); // Log the error to the console
    return res.status(500).json({
      message: "Error retrieving category",
      error: error.message,
    });
  }
};

export {
  addCategory,
  getAllCategories,
  getAllParentCategories,
  getAllSubCategories,
  getCategoriesByParentId,
  uploadSingleFile,
  getFirstTwoLevelsOfCategories,
  getCategoryById,
};
