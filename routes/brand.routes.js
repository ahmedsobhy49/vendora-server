import { Router } from "express";
import {
  getAllBrands,
  addBrand,
  getBrandsByCategoryId,
  uploadSingleFile,
} from "../controllers/brand.controller.js";
const BrandRouter = Router();

BrandRouter.post("/brand/add-brand", uploadSingleFile, addBrand);

BrandRouter.get("/brand/all-brands", getAllBrands);
BrandRouter.get("/brands/category/:categoryId", getBrandsByCategoryId);

export default BrandRouter;
