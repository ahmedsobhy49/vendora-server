import express from "express";
import {
  registerUser,
  updateUserInfo,
} from "../controllers/user.controller.js";
import authMiddleWare from "../middleware/auth/middleware.js";

const userRouter = express.Router();

// Route for user registration\
userRouter.post("/user/register", registerUser);
userRouter.put("/user/update-user-info", updateUserInfo);

export default userRouter;
