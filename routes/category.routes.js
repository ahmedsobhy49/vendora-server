import { Router } from "express";
import {
  addCategory,
  getAllParentCategories,
  uploadSingleFile,
  getCategoriesByParentId,
  getAllSubCategories,
  getAllCategories,
  getFirstTwoLevelsOfCategories,
  getCategoryById,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

// Route to add a new category
categoryRouter.post("/category", uploadSingleFile, addCategory);

// Route to get all top-level parent categories
categoryRouter.get("/categories/parents", getAllParentCategories);

// Route to get categories by parent ID
categoryRouter.get(
  "/categories/parent/:parentCategoryId",
  getCategoriesByParentId
);

// Route to get all subcategories
categoryRouter.get("/categories/subcategories", getAllSubCategories);

// Route to get all categories
categoryRouter.get("/categories", getAllCategories);

// Route to get categories for the first two levels of hierarchy
categoryRouter.get("/categories/hierarchy", getFirstTwoLevelsOfCategories);

// Route to get a category by ID
categoryRouter.get("/category/:categoryId", getCategoryById); // Add this line

export default categoryRouter;
