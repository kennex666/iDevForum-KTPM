import express from "express";
import {
	createUser, getUserByEmail,
	updateUser, getAllUsers, getUserById, deleteUser, updatePassword
} from "../services/userService";

const router = express.Router();

router.post("/register", async (req, res) => {
	try {
		const { name, role, accountState, username, email, password } = req.body;
		const user = await createUser(name, role, accountState, username, email, password);
		res.status(201).json(user);
	} catch (error) {
		res.status(500).json({ error: "Error creating user" });
	}
});

router.get("/getall", async (req: any, res: any) => {
	try {
		const users = await getAllUsers();
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: "Error fetching users" });
	}
});

router.get("/:id", async (req: any, res: any) => {
	try {
		const user = await getUserById(req.params.id);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: "Error fetching user" });
	}
});

router.get("/email/:email", async (req: any, res: any) => {
	try {
		console.log("email", req.params.email);
		const user = await getUserByEmail(req.params.email);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: "Error fetching user" });
	}
});

router.put("/:id", async (req: any, res: any) => {
	try {
		const { id } = req.params;
		console.log("userId", id);
		const updateData = req.body;
		console.log("updateData", updateData);
		const user = await updateUser(id, updateData);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: "Error updating user" });
	}
});

router.delete("/:id", async (req: any, res: any) => {
	try {
		const { id } = req.params;
		const user = await deleteUser(id);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	}
	catch (error) {
		res.status(500).json({ error: "Error deleting user" });
	}
});

router.put("/updatepassword/:id", async (req: any, res: any) => {
	try {
		const { id } = req.params;
		const { newPassword, oldPassword } = req.body;
		const user = await updatePassword(id, newPassword, oldPassword);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	}
	catch (error) {
		res.status(500).json({ error: "Error updating password" });
	}
});



export default router;
