import express from "express";
import { registerUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

// Route for user registration\
userRouter.post("/user/register", registerUser);

export default userRouter;
