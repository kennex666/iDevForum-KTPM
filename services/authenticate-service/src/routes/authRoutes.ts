import express from "express";
import { createUser, getUserByEmail } from "../services/authService";
import { UserClient } from "../clients/user.client";

const router = express.Router();

router.post("/register", async (req: any, res: any) => {
	console.log("Registering user", req.body);
	try {
		const { name, email, password, repassword } = req.body;

		if (!name || name.trim() === "")
			return res.status(200).json({ errorCode: 502, errorMessage: "Name is required" });
		if (!email || email.trim() === "")
			return res.status(200).json({ errorCode: 503, errorMessage: "Email is required" });
		if (!password || password.length < 6)
			return res.status(200).json({ errorCode: 504, errorMessage: "Password must be at least 6 characters" });
		if (password !== repassword)
			return res
				.status(400)
				.json({
					errorCode: 501,
					errorMessage: "Passwords do not match",
				});

				
		const user = await UserClient.createUser({
			name,
			email,
			password,
			role: 0,
			accountState: "ACTIVE",
		});
		if (user.data)
			res.status(200).json(user.data);
		else
			res.status(200).json(user);
	} catch (error) {
		console.log("Error creating user", error);
		res.status(200).json({ errorCode: 500, errorMessage: "Error creating user" });
	}
});

router.get("/login", async (req: any, res: any) => {
	try {
		const user = await getUserByEmail(req.params.email);

		if (!user) return res.status(200).json({ message: "User not found" });

		if (user.password !== req.params.password) // Mockup
			return res.status(200).json({ message: "Invalid credentials" });
		res.json(user);
	} catch (error) {
		res.status(200).json({ error: "Error fetching user" });
	}
});

export default router;
