import adminModel from "../models/admin.model.js";
import createToken from "../utils/createToken.js";
import response from "../utils/rsponse.js";
import bcrypt from "bcrypt";

class AuthControllers {
  adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      // check if the login email are exist in the database if true it will return the admin data, else it will return null
      const admin = await adminModel.findOne({ email }).select("+password");
      if (!admin) {
        response(res, 404, { message: "wrong email or password" });
        return;
      }
      const matchPassword = await bcrypt.compare(password, admin?.password);
      if (admin && matchPassword) {
        const token = await createToken({ id: admin.id, role: admin.role });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        response(res, 200, {
          message: "login success",
          user: { email, role: admin.role, name: admin.name },
          token,
        });
      } else {
        response(res, 404, { message: "wrong email or password" });
      }
    } catch (error) {
      response(res, 500, { message: error.message });
    }
  };

  logout = async (req, res) => {
    try {
      // Clear the access token cookie
      res.clearCookie("accessToken");
      response(res, 200, { message: "Logout successful" });
    } catch (error) {
      response(res, 500, { message: error.message });
    }
  };

  getUser = async (req, res) => {
    const { id, role } = req;
    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        response(res, 200, { user: user });
      } else {
        console.log("seller");
      }
    } catch (error) {
      response(res, 500, { message: error.message });
    }
  };
}

const authControllers = new AuthControllers();

export default authControllers;
