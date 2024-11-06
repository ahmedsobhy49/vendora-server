import { Router } from "express";
import authControllers from "../controllers/auth.controller.js";
import authMiddleWare from "../middleware/auth/middleware.js";

const authRouter = Router();

// Correcting route paths with a leading slash
authRouter.post("/auth/login", authControllers.login);
// authRouter.get("/auth/getuser", authControllers.getUser);
authRouter.post("/auth/logout", authControllers.logout);

// route for getting  current logging in user info
authRouter.get("/auth/user/", authControllers.getUserInfo);

export default authRouter;
