import SellerModel from "../models/seller.model.js";
import AddressModel from "../models/address.model.js";
import bcrypt from "bcrypt"; // For password hashing
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });
export const uploadSingleFile = upload.single("image");

export const registerSeller = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      businessInfo,
      phone,
      bankDetails,
      address,
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

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
      image: imagePath, // Save the image path
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
    console.error("Error registering seller:", error); // Log the error for debugging
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

export const getInactiveSellers = async (req, res) => {
  try {
    // Fetch all sellers
    const inactiveSellers = await SellerModel.find({ status: "inactive" });

    return res.status(200).json({
      success: true,
      sellers: inactiveSellers,
    });
  } catch (error) {
    console.error("Error fetching active sellers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateSellerStatus = async (req, res) => {
  const { sellerId } = req.params;
  const { status } = req.body;

  try {
    const seller = await SellerModel.findById(sellerId);
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    // Update the seller's status based on the provided status in the request
    seller.status = status;

    // Set activeAt if status is being changed to active
    if (status === "active") {
      seller.activeAt = Date.now();
    }

    await seller.save();

    return res.status(200).json({
      success: true,
      message: `Seller status updated to ${status}`,
    });
  } catch (error) {
    console.error("Error updating seller status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getSellerById = async (req, res) => {
  const { sellerId } = req.params;

  try {
    // Find the seller by ID and populate the address if it exists
    const seller = await SellerModel.findById(sellerId).populate("address");

    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    return res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    console.error("Error fetching seller by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getYearlySellerStatistics = async (req, res) => {
  try {
    const sellers = await SellerModel.find(
      { status: "active" },
      { activeAt: 1 }
    );

    // Initialize an object to count sellers by month
    const monthlyCounts = Array(12).fill(0);
    let totalYearlySellers = 0;

    sellers.forEach((seller) => {
      if (seller.activeAt) {
        const month = seller.activeAt.getMonth(); // 0 for January, 1 for February, etc.
        monthlyCounts[month]++;
        totalYearlySellers++;
      }
    });

    // Create an array with month names and counts
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const result = monthlyCounts.map((count, index) => ({
      month: months[index],
      count,
    }));

    // Add the yearly total
    const response = {
      yearTotal: totalYearlySellers,
      monthlyStatistics: result,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching yearly seller statistics:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
