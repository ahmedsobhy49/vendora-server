import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js"; // Assuming you have an AddressModel
import cartModel from "../models/cart.model.js"; // Import Cart model
import wishlistModel from "../models/wishlist.model.js";
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, addresses } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with basic details
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      wishlistId: null, // Initialize wishlistId as null or undefined
      cartId: null, // Initialize cartId as null or undefined
      addresses: [], // Initialize an empty array for addresses
    });

    const savedUser = await newUser.save();

    // Step 1: Create the user's cart
    const newCart = new cartModel({
      userId: savedUser._id,
      items: [], // Start with an empty cart
    });

    const savedCart = await newCart.save();
    savedUser.cartId = savedCart._id;
    await savedUser.save();

    // Step 2: Create the user's wishlist

    const newWishlist = new wishlistModel({
      userId: savedUser._id,
      items: [], // Start with an empty cart
    });
    const savedwishlist = await newWishlist.save();
    savedUser.wishlistId = savedwishlist._id;
    await savedUser.save();

    // Create and save address documents if provided
    if (addresses && Array.isArray(addresses)) {
      const addressDocuments = addresses.map((address) => ({
        userId: savedUser._id,
        userType: "user",
        street: address.street,
        city: address.city,
        state: address.state,
        buildingNumber: address.buildingNumber,
        zip: address.zip,
        country: address.country,
      }));

      const savedAddresses = await AddressModel.insertMany(addressDocuments);

      // Update the user with the saved addresses
      const addressIds = savedAddresses.map((address) => address._id);
      savedUser.addresses = addressIds;
      await savedUser.save();
    }

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error); // Log the error for debugging
    return res.status(500).json({ message: "Error registering user", error });
  }
};

// Update User Info Function
const updateUserInfo = async (req, res) => {
  try {
    const { id, firstName, lastName, phone, gender } = req.body;

    // Find the user by ID
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update only the fields that are provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;

    // Save the updated user
    await user.save();

    return res
      .status(200)
      .json({ message: "User information updated successfully", user });
  } catch (error) {
    console.error("Error updating user info:", error);
    return res.status(500).json({ message: "Error updating user info", error });
  }
};

export { registerUser, updateUserInfo };
