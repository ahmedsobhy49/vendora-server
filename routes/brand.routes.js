import { Router } from "express";
import {
  getAllBrands,
  addBrand,
  uploadSingleFile,
} from "../controllers/brand.controller.js";
const BrandRouter = Router();

BrandRouter.post("/brand/add-brand", uploadSingleFile, addBrand);

BrandRouter.get("/brand/all-brands", getAllBrands);

export default BrandRouter;
