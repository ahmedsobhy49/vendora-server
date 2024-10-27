import { Router } from "express";
import authControllers from "../controllers/auth.controller.js";
import authMiddleWare from "../middleware/auth/middleware.js";

const authRouter = Router();

authRouter.post("/admin/login", authControllers.adminLogin);
authRouter.get("/getuser", authMiddleWare, authControllers.getUser);
authRouter.post("/auth/logout", authControllers.logout);

export default authRouter;
