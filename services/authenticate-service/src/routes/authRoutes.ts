import express from "express";

import { loginUser, queryMe, registerUser } from "../controllers/authController";
import { jwtMiddleware } from "../middleware/jwtAuthenticate";
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", jwtMiddleware, queryMe);

export default router;
