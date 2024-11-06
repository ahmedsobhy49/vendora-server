// export { addProduct };
import multer from "multer";
import path from "path";
import ProductModel from "../models/product.model.js";

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Path where images will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Generate a unique suffix
    cb(
      null,
      `${file.fieldname}_${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });
// Function to upload images
export const uploadMultipleFiles = upload.array("productImages", 10); // Accept up to 10 images
async function uploadProductImages(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded." });
  }

  // Prepare image paths for response
  const imagePaths = req.files.map((file) => ({
    url: `/uploads/${file.filename}`,
    altText: file.originalname || "",
  }));

  return res.status(200).json({ images: imagePaths }); // Return the image URLs
}

// Function to add a product with images
async function addProduct(req, res) {
  try {
    // Extract images from the body
    const imagePaths = req.body.productImages || []; // Get the image paths sent from the frontend

    const newProduct = new ProductModel({
      ...req.body,
      productImages: imagePaths, // Include imagePaths in the product
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(400).json({ error: error.message });
  }
}

// function to get products related to a specific seller
async function getProductsBySeller(req, res) {
  try {
    const { sellerId } = req.params;

    // Adjust the query path based on schema
    const products = await ProductModel.find({
      "seller._id": sellerId, // Match the nested _id within the seller object
    });

    res.json(
      products.length ? products : { message: "No products found for seller" }
    );
  } catch (error) {
    console.error("Error fetching products:", error); // Error logging for debugging
    res.status(500).json({ error: "Server error" });
  }
}

// function to get all products for admin
async function getAllProducts(req, res) {
  console.log("getAllProducts called");
  try {
    const products = await ProductModel.find();
    res.json(products.length ? products : { message: "No products found " });
  } catch (error) {
    console.error("Error fetching products:", error); // Error logging for debugging
    res.status(500).json({ error: "Server error" });
  }
}

// Function to calculate monthly product creation statistics by seller without cumulative totals
async function getMonthlyProductStatisticsBySeller(req, res) {
  try {
    const { sellerId } = req.params;
    const year = req.query.year || new Date().getFullYear();

    // Find products created by the seller in the specified year
    const products = await ProductModel.find({
      "seller._id": sellerId,
      createdAt: {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    });

    // Initialize an array with 12 months, setting each month's product count to 0
    const monthlyStatistics = Array.from({ length: 12 }, (_, index) => ({
      month: new Date(year, index).toLocaleString("default", { month: "long" }),
      count: 0,
    }));

    // Count products for each month without cumulative totals
    products.forEach((product) => {
      const month = new Date(product.createdAt).getMonth(); // Get month index (0 for Jan, 11 for Dec)
      monthlyStatistics[month].count += 1;
    });

    res.status(200).json({ year, monthlyStatistics });
  } catch (error) {
    console.error("Error fetching monthly product statistics:", error);
    res.status(500).json({ error: "Server error" });
  }
}

export {
  uploadProductImages,
  addProduct,
  getProductsBySeller,
  getAllProducts,
  getMonthlyProductStatisticsBySeller,
};
