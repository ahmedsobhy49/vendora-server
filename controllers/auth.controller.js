import adminModel from "../models/admin.model.js";
import createToken from "../utils/createToken.js";
import response from "../utils/rsponse.js";
import bcrypt from "bcrypt";
import SellerModel from "../models/seller.model.js";
import jwt from "jsonwebtoken";

class AuthControllers {
  login = async (req, res) => {
    const { email, password } = req.body;

    try {
      let user = await adminModel.findOne({ email }).select("+password");
      let role = "admin";

      if (!user) {
        user = await SellerModel.findOne({ email }).select("+password");
        role = "seller";
      }

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return response(res, 401, { message: "Wrong email or password" });
      }

      if (role === "seller" && user.status !== "active") {
        return response(res, 403, { message: "This account is inactive" });
      }

      const token = await createToken({ id: user.id, role });

      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      });

      response(res, 200, {
        message: "Login success",
        user: {
          _id: user.id,
          email,
          role,
          name:
            role === "admin" ? user.name : `${user.firstName} ${user.lastName}`,
        },
        token,
      });
    } catch (error) {
      response(res, 500, { message: error.message });
    }
  };

  logout = async (req, res) => {
    try {
      res.clearCookie("accessToken");
      response(res, 200, { message: "Logout successful" });
    } catch (error) {
      response(res, 500, { message: error.message });
    }
  };

  // getUser = async (req, res) => {
  //   const { id, role } = req;
  //   try {
  //     let user;
  //     if (role === "admin") {
  //       user = await adminModel.findById(id);
  //     } else if (role === "seller") {
  //       user = await SellerModel.findById(id);
  //     }

  //     if (!user) {
  //       return response(res, 404, { message: "User not found" });
  //     }

  //     response(res, 200, { user });
  //   } catch (error) {
  //     response(res, 500, { message: error.message });
  //   }
  // };

  // Function to get user information with token validation
  getUserInfo = async (req, res) => {
    try {
      // Retrieve token from the request headers
      const authHeader = req.headers["authorization"];
      const token =
        authHeader && authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : authHeader;

      // Check if token is provided
      if (!token) {
        return res
          .status(401)
          .json({ message: "Token is required for authentication." });
      }

      // Verify token and extract payload
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.SECRET); // Replace with your JWT secret
      } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      const { id, role } = decodedToken; // Extract user ID and role from token

      let user;

      // Determine the model to query based on the role
      if (role === "admin") {
        user = await adminModel.findById(id).select("-password");
      } else if (role === "seller") {
        user = await SellerModel.findById(id).select("-password");
      } else {
        return res.status(400).json({ message: "Invalid role provided." });
      }

      // Handle case where the user is not found
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user data if everything is valid
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user info:", error);
      return res.status(500).json({ message: error.message });
    }
  };
}
const authControllers = new AuthControllers();
export default authControllers;
