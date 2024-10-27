import express from "express";
import {
  registerSeller,
  getPendingSellers,
  getActiveSellers,
  approveSeller,
} from "../controllers/seller.controller.js"; // Adjust the path as needed

const sellerRouter = express.Router();

// Route for seller registration
sellerRouter.post("/sellers/register", registerSeller);

// Route to get all pending seller requests
sellerRouter.get("/sellers/requests", getPendingSellers);

// Route to get all active sellers
sellerRouter.get("/sellers/active", getActiveSellers);

// Route to approve a seller
sellerRouter.patch("/sellers/:id/approve", approveSeller);

export default sellerRouter;
