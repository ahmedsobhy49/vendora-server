import SellerModel from "../models/seller.model.js";
import AddressModel from "../models/address.model.js";
import bcrypt from "bcrypt"; // For password hashing

export const registerSeller = async (req, res) => {
  try {
    const {
      firstName,
      image,
      lastName,
      email,
      password,
      businessInfo,
      phone,
      bankDetails,
      address,
    } = req.body;

    // Check if a seller with the same email already exists
    const existingSeller = await SellerModel.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1: Create the seller with basic details
    const newSeller = new SellerModel({
      firstName,
      lastName,
      image,
      email,
      phone,
      password: hashedPassword,
      businessInfo,
      bankDetails,
      status: "pending", // Pending approval
      address: null, // Set address to null or skip this line to leave it undefined
    });

    const savedSeller = await newSeller.save();

    // Step 2: Create and save the address document if provided
    if (address) {
      const newAddress = new AddressModel({
        userId: savedSeller._id,
        userType: "Seller",
        street: address.street,
        city: address.city,
        state: address.state,
        buildingNumber: address.buildingNumber,
        zip: address.zip,
        country: address.country,
      });

      const savedAddress = await newAddress.save();

      // Step 3: Update the seller with the saved address `_id`
      savedSeller.address = savedAddress._id;
      await savedSeller.save();
    }

    return res
      .status(201)
      .json({ message: "Seller registered successfully, pending approval." });
  } catch (error) {
    return res.status(500).json({ message: "Error registering seller", error });
  }
};

export const getPendingSellers = async (req, res) => {
  try {
    // Fetch all sellers with a status of 'pending'
    const pendingSellers = await SellerModel.find({ status: "pending" });

    return res.status(200).json({
      success: true,
      sellers: pendingSellers,
    });
  } catch (error) {
    console.error("Error fetching seller requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getActiveSellers = async (req, res) => {
  try {
    // Fetch all sellers
    const activeSellers = await SellerModel.find({ status: "active" });

    return res.status(200).json({
      success: true,
      sellers: activeSellers,
    });
  } catch (error) {
    console.error("Error fetching active sellers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const approveSeller = async (req, res) => {
  const { id } = req.params;

  try {
    const seller = await SellerModel.findById(id);
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    // Update the seller's status to approved
    seller.status = "active"; // or any status you want to set for approved sellers
    await seller.save();

    return res.status(200).json({ success: true, message: "Seller approved" });
  } catch (error) {
    console.error("Error approving seller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
