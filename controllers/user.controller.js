import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"; // For password hashing

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;

    // Check if a seller with the same email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Seller already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1: Create the seller with basic details
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      wishlistId: null, // Set wishlistId to null or skip this line to leave it undefined
      cartId: null, // Set cartId to null or skip this line to leave it undefined
      address: null, // Set address to null or skip this line to leave it undefined
    });

    const savedUser = await newUser.save();

    // Step 2: Create and save the address document if provided
    if (address) {
      const newAddress = new AddressModel({
        userId: savedUser._id,
        userType: "user",
        street: address.street,
        city: address.city,
        state: address.state,
        buildingNumber: address.buildingNumber,
        zip: address.zip,
        country: address.country,
      });

      const savedAddress = await newAddress.save();

      // Step 3: Update the seller with the saved address `_id`
      savedUser.address = savedAddress._id;
      await savedUser.save();
    }

    return res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error); // Log the error for debugging
    return res.status(500).json({ message: "Error registering user", error });
  }
};

export { registerUser };
