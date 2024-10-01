import { Router } from "express";
import authControllers from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/admin/login", authControllers.adminLogin);

export default authRouter;
