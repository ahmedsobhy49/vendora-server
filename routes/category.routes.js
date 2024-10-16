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

// Change this line to handle file uploads

categoryRouter.post("/category/add/category", uploadSingleFile, addCategory);

categoryRouter.get("/category/all-parent-categories", getAllParentCategories);

categoryRouter.get(
  "/category/get-by-parent/:parentCategoryId",
  getCategoriesByParentId
);

categoryRouter.get("/category/all-subcategories", getAllSubCategories);
categoryRouter.get("/category/all-categories", getAllCategories);
categoryRouter.get(
  "/category/first-two-levels-categories",
  getFirstTwoLevelsOfCategories
);

export default categoryRouter;
