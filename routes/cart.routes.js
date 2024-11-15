import authMiddleWare from "../middleware/auth/middleware";
import express from "express";

const cartRouter = express.Router();
// Add to cart
cartRouter.post("/cart", authMiddleWare, addToCart);

// Remove an item from the cart
cartRouter.delete("/cart/:productId", authMiddleWare, removeFromCart);

// Clear the entire cart
cartRouter.delete("/cart", authMiddleWare, clearCart);

export default cartRouter;
