import express from "express";
import { createUser, getUserByEmail } from "../services/authService";
import { UserClient } from "../clients/user.client";

const router = express.Router();

router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const user = await UserClient.createUser({
			name,
			email,
			password,
		});
		res.status(201).json(user);
	} catch (error) {
		res.status(500).json({ error: "Error creating user" });
	}
});

router.get("/login", async (req: any, res: any) => {
	try {
		const user = await getUserByEmail(req.params.email);

		if (!user) return res.status(404).json({ message: "User not found" });

		if (user.password !== req.params.password) // Mockup
			return res.status(401).json({ message: "Invalid credentials" });
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: "Error fetching user" });
	}
});

export default router;
