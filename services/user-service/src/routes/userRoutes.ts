import express from "express";
import {
	createUser, getUserByEmail,
	updateUser, getAllUsers, getUserById, deleteUser, updatePassword,
	searchUsers
} from "../services/userService";

const router = express.Router();


router.get("/ping", (req, res) => {
	res.send("User Service is running...");
});


router.post("/register", async (req: any, res: any) => {
	try {
		const { name, role, accountState, username, email, password } = req.body;
		if (!name) return res.status(400).json({ message: "Name is required" });
        if (!username || username.trim() === "") return res.status(400).json({ message: "Username is required" });
        if (!email || email.trim() === "") return res.status(400).json({ message: "Email is required" });
        if (!password || password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
		const user = await createUser(name, role, accountState, username, email, password);
		return res.status(201).json({message:"User registered successfully", user});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/getall", async (req: any, res: any) => {

	try {
		const users = await getAllUsers();
		res.status(200).json(users);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/search", async (req: any, res: any) => {
	try {
		const filters = req.query;
		console.log("Filters:", filters);
		if (Object.keys(filters).length === 0) {
			return res.status(400).json({ message: "No filters provided" });
		}
		const users = await searchUsers(filters);

		if (!users) return res.status(404).json({ message: "User not found" });
		return res.status(200).json(users);

	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});
router.get("/:id", async (req: any, res: any) => {
	try {
		if (!req.params.id) return res.status(400).json({ message: "User id is required" });
		const user = await getUserById(req.params.id);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.status(200).json(user);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/email/:email", async (req: any, res: any) => {
	try {
		console.log("email", req.params.email);
		if (!req.params.email) return res.status(400).json({ message: "User email is required" });
		const user = await getUserByEmail(req.params.email);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.status(200).json(user);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
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
		res.status(200).json(user);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

router.delete("/:id", async (req: any, res: any) => {
	try {
		const { id } = req.params;
		const user = await deleteUser(id);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.status(200).json({ message: "User deleted successfully", user });

	}
	catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

router.put("/updatepassword/:id", async (req: any, res: any) => {
	try {
		const { id } = req.params;
		const { newPassword, oldPassword } = req.body;
		if(!newPassword)
			return res.status(400).json({ message: "New password is required" });
		if(newPassword.length < 6)
			return res.status(400).json({ message: "New password must be at least 6 characters" });
		if(!oldPassword)
			return res.status(400).json({ message: "Old password is required" });
		const user = await updatePassword(id, newPassword, oldPassword);
		if (!user) return res.status(404).json({ message: "User not found" });
		return res.status(200).json({ message: "Password updated successfully", user });
	}
	catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});



export default router;
