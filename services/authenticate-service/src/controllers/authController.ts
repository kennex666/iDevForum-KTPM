import { UserClient } from "../clients/user.client";
import { generateToken } from "../utils/jwt";
export const registerUser = async (req: any, res: any) => {
	console.log("Registering user", req.body);
	try {
		const { name, email, password, repassword } = req.body;

		if (!name || name.trim() === "")
			return res
				.status(200)
				.json({ errorCode: 502, errorMessage: "Name is required" });
		if (!email || email.trim() === "")
			return res
				.status(200)
				.json({ errorCode: 503, errorMessage: "Email is required" });
		if (!password || password.length < 6)
			return res.status(200).json({
				errorCode: 504,
				errorMessage: "Password must be at least 6 characters",
			});
		if (password !== repassword)
			return res.status(400).json({
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
		if (user.data) res.status(200).json(user.data);
		else res.status(200).json(user);
	} catch (error) {
		console.log("Error creating user", error);
		res.status(200).json({
			errorCode: 500,
			errorMessage: "Error creating user",
		});
	}
};

export const loginUser = async (req: any, res: any) => {
	try {
		const { email, password } = req.body;

		if (!email || email.trim() === "")
			return res.status(200).json({
				errorCode: 503,
				errorMessage: "Email is required",
			});

		if (!password || password.length < 6)
			return res.status(200).json({
				errorCode: 504,
				errorMessage: "Password must be at least 6 characters",
			});

		const result = await UserClient.getUserViaEmail(email);

		if (result.errorCode != 200) {
			return res.status(200).json({
				errorCode: result.errorCode,
				errorMessage: result.errorMessage,
			});
		}

		const user = result.data;

		if (!user)
			return res
				.status(200)
				.json({ errorCode: 404, errorMessage: "User not found" });

		console.log("user", user);
		if (user.password != password)
			// Mockup
			return res.status(200).json({ message: "Invalid credentials" });

		// Generate JWT token
		const jwtAccessToken = generateToken(user);
		res.json({
			errorCode: 200,
			errorMessage: "Login successfully",
			data: {
				accessToken: jwtAccessToken,
				...user,
				password: undefined, // Remove password from response
			},
		});
	} catch (error) {
		res.status(200).json({
			errorCode: 500,
			errorMessage: "Internal server error",
		} as any);
	}
};
