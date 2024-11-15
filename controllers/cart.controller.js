import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

const addToCart = async (req, res) => {
  try {
    const { userId } = req.user; // Assume `req.user` contains authenticated user info
    const { productId, quantity } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found." });

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Added to cart successfully.", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// Remove an item from the cart
const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.user; // From authentication middleware
    const { productId } = req.params;

    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Item removed from cart.", cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing from cart", error });
  }
};

// Clear the entire cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.user; // From authentication middleware

    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared.", cart });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart", error });
  }
};

export { addToCart, removeFromCart, clearCart };
