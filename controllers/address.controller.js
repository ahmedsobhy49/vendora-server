import AddressModel from "../models/address.model.js";
import mongoose from "mongoose";

// function to get address by user id
const getAddressByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    // Find address associated with the user ID
    const address = await AddressModel.find({ userId });
    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    // Check if address is found
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found for this user." });
    }

    // Return the found address
    return res.status(200).json({ success: true, address });
  } catch (error) {
    console.error("Error fetching address by user ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// function to create address for a user

const postAddress = async (req, res) => {
  try {
    const { userId, street, city, state, buildingNumber, zip, country } =
      req.body;

    // Create new address instance
    const newAddress = new AddressModel({
      userId,
      street,
      city,
      state,
      buildingNumber,
      zip,
      country,
    });

    // Save address (userType will be set automatically)
    const savedAddress = await newAddress.save();

    res.status(201).json(savedAddress);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export { postAddress, getAddressByUserId };
