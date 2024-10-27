import { Router } from "express";
import {
  addCategory,
  getAllParentCategories,
  uploadSingleFile,
  getCategoriesByParentId,
  getAllSubCategories,
  getAllCategories,
  getFirstTwoLevelsOfCategories,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

// categoryRouter.post("/category/add/category", uploadSingleFile, addCategory);

// categoryRouter.get("/category/all-parent-categories", getAllParentCategories);

// categoryRouter.get(
//   "/category/get-by-parent/:parentCategoryId",
//   getCategoriesByParentId
// );

// categoryRouter.get("/category/all-subcategories", getAllSubCategories);
// categoryRouter.get("/category/all-categories", getAllCategories);
// categoryRouter.get(
//   "/category/first-two-levels-categories",
//   getFirstTwoLevelsOfCategories
// );

// Route to add a new category
categoryRouter.post("/category", uploadSingleFile, addCategory);

// Route to get all top-level parent categories
categoryRouter.get("/categories/parents", getAllParentCategories);

// Route to get categories by parent ID
categoryRouter.get("/categories/parent/:parentCategoryId", getCategoriesByParentId);

// Route to get all subcategories
categoryRouter.get("/categories/subcategories", getAllSubCategories);

// Route to get all categories
categoryRouter.get("/categories", getAllCategories);

// Route to get categories for the first two levels of hierarchy
categoryRouter.get("/categories/hierarchy", getFirstTwoLevelsOfCategories);


export default categoryRouter;
