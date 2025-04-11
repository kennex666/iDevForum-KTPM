import express from "express";
import { createUser, getUserByEmail } from "../services/authService";
import { UserClient } from "../clients/user.client";
import { loginUser, registerUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);

router.get("/login", loginUser);

export default router;
