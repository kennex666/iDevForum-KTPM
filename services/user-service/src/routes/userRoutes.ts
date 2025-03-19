import express from "express";
import { createUser, getUserByEmail } from "../services/userService";

const router = express.Router();

router.post("/register", async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const user = await createUser(username, email, password);
		res.status(201).json(user);
	} catch (error) {
		res.status(500).json({ error: "Error creating user" });
	}
});

router.get("/:email", async (req: any, res: any) => {
	try {
		const user = await getUserByEmail(req.params.email);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: "Error fetching user" });
	}
});

export default router;
