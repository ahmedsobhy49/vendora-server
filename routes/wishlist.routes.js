import authMiddleWare from "../middleware/auth/middleware";
import express from "express";

const wishlistRouter = express.Router();

// Add to wishlist
wishlistRouter.post("/wishlist", authMiddleWare, addToWishlist);

// Remove an item from wishlist
wishlistRouter.delete(
  "/wishlist/:productId",
  authenticateUser,
  removeFromWishlist
);

// Clear entire wishlist
wishlistRouter.delete("/wishlist", authMiddleWare, clearWishlist);

export default wishlistRouter;
