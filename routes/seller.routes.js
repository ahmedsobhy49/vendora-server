import express from "express";
import {
  registerSeller,
  getPendingSellers,
  getActiveSellers,
  updateSellerStatus,
  getInactiveSellers,
  uploadSingleFile,
  getSellerById,
  getYearlySellerStatistics,
  deleteSellerById,
} from "../controllers/seller.controller.js"; // Adjust the path as needed

const sellerRouter = express.Router();

// Route for seller registration
sellerRouter.post("/sellers/register", uploadSingleFile, registerSeller);

// Route to get all pending seller requests
sellerRouter.get("/sellers/requests", getPendingSellers);

// Route to get sellers Statistics
sellerRouter.get("/sellers/stats/yearly", getYearlySellerStatistics);

// Route to get all active sellers
sellerRouter.get("/sellers/active", getActiveSellers);

// Route to get all inactive sellers
sellerRouter.get("/sellers/inactive", getInactiveSellers);

// Route to change seller status
sellerRouter.patch("/sellers/:sellerId/status", updateSellerStatus);

// Route to get a specific seller by ID
sellerRouter.get("/sellers/:sellerId", getSellerById);

sellerRouter.delete("/sellers/:sellerId", deleteSellerById);

export default sellerRouter;
