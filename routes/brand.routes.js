import { Router } from "express";
import {
  getAllBrands,
  addBrand,
  getBrandsByCategoryId,
  uploadSingleFile,
  deleteBrandById,
} from "../controllers/brand.controller.js";

const BrandRouter = Router();

// Create a new brand
BrandRouter.post("/brands", uploadSingleFile, addBrand);

// Get all brands
BrandRouter.get("/brands", getAllBrands);

// Get brands by category ID
BrandRouter.get("/brands/category/:categoryId", getBrandsByCategoryId);

// detet the brand by brand ID
BrandRouter.delete("/brands/:brandId", deleteBrandById);

export default BrandRouter;
