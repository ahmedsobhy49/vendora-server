import WishlistModel from "../models/wishlist.model.js";

const addToWishlist = async (req, res) => {
  try {
    const { userId } = req.user; // Assume `req.user` contains authenticated user info
    const { productId } = req.body;

    let wishlist = await WishlistModel.findOne({ userId });

    if (!wishlist) {
      wishlist = new WishlistModel({ userId, items: [] });
    }

    if (wishlist.items.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist." });
    }

    wishlist.items.push(productId);
    await wishlist.save();

    res
      .status(200)
      .json({ message: "Added to wishlist successfully.", wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};

// Remove an item from the wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId } = req.user; // From authentication middleware
    const { productId } = req.params;

    const wishlist = await WishlistModel.findOne({ userId });
    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found." });

    wishlist.items = wishlist.items.filter(
      (item) => item.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json({ message: "Item removed from wishlist.", wishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
};

// Clear the entire wishlist
const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.user; // From authentication middleware

    const wishlist = await WishlistModel.findOne({ userId });
    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found." });

    wishlist.items = [];
    await wishlist.save();
    res.status(200).json({ message: "Wishlist cleared.", wishlist });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ message: "Error clearing wishlist", error });
  }
};

export { addToWishlist, removeFromWishlist, clearWishlist };
