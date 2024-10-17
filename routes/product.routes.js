import { Product } from "../models/product.model.js";
import { Router } from "express";

const productRouter = Router();
// Route to get all general products
productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find({ __t: { $ne: "ClothingProduct" } }); // Exclude clothing products
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get a specific product by ID
productRouter.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.__t === "ClothingProduct") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route to add a new general product
productRouter.post("/add/new/product", async (req, res) => {
  try {
    const newProduct = new Product(req.body); // Creating a new general product
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default productRouter;
