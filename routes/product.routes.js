import {
  addProduct,
  uploadMultipleFiles,
  uploadProductImages,
  getProductsBySeller,
  getAllProducts,
  getMonthlyProductStatisticsBySeller,
} from "../controllers/product.controller.js";
import Product from "../models/product.model.js";
import { Router } from "express";

const productRouter = Router();
// // Route to get all general products
// productRouter.get("/product", async (req, res) => {
//   const { sellerId } = req.query; // Get the sellerId from query parameters
//   console.log(sellerId);
//   try {
//     // Check if sellerId is provided
//     if (!sellerId) {
//       return res.status(400).json({ error: "Seller ID is required" });
//     }

//     // Find products by sellerId, excluding clothing products
//     const products = await Product.find({
//       sellerId: sellerId,
//     });

//     // Return the found products
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error); // Log the error for debugging
//     res.status(500).json({ error: "Server error" });
//   }
// });

// Route to get a specific product by ID
productRouter.get("/products/:sellerId", getProductsBySeller);

// Route to upload product images
productRouter.post("/product/upload", uploadMultipleFiles, uploadProductImages);

// Route to add a new product
productRouter.post("/product", uploadMultipleFiles, addProduct);

// Route to get all  products
productRouter.get("/products", getAllProducts);

// Route to get monthly product statistics for a specific seller
productRouter.get(
  "/products/sellers/monthly-stats/:sellerId",
  getMonthlyProductStatisticsBySeller
);

export default productRouter;
