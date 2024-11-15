// import userModel from "../models/user.model.js";
// import bcrypt from "bcrypt"; // For password hashing

// const registerUser = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, phone, address } = req.body;

//     // Check if a seller with the same email already exists
//     const existingUser = await userModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Seller already exists." });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Step 1: Create the seller with basic details
//     const newUser = new userModel({
//       firstName,
//       lastName,
//       email,
//       phone,
//       password: hashedPassword,
//       wishlistId: null, // Set wishlistId to null or skip this line to leave it undefined
//       cartId: null, // Set cartId to null or skip this line to leave it undefined
//       address: null, // Set address to null or skip this line to leave it undefined
//     });

//     const savedUser = await newUser.save();

//     // Step 2: Create and save the address document if provided
//     if (address) {
//       const newAddress = new AddressModel({
//         userId: savedUser._id,
//         userType: "user",
//         street: address.street,
//         city: address.city,
//         state: address.state,
//         buildingNumber: address.buildingNumber,
//         zip: address.zip,
//         country: address.country,
//       });

//       const savedAddress = await newAddress.save();

//       // Step 3: Update the seller with the saved address `_id`
//       savedUser.address = savedAddress._id;
//       await savedUser.save();
//     }

//     return res.status(201).json({ message: "user registered successfully" });
//   } catch (error) {
//     console.error("Error registering user:", error); // Log the error for debugging
//     return res.status(500).json({ message: "Error registering user", error });
//   }
// };

// export { registerUser };

import userModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js"; // Assuming you have an AddressModel
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, addresses } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
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

export { registerUser };
