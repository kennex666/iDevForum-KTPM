// utils/UserCacheService.ts
import { redis } from "./redisClient";
import {
	getUserById,
	getUserByEmail,
	updateUser,
	deleteUser,
} from "../services/userService";

export class UserCacheService {
	async getById(id: string) {
		const key = `user:id:${id}`;
		try {
			const cached = await redis.get(key);
			if (cached) {
				console.log("Cache hit for user:", id);
				return JSON.parse(cached);
			}
		} catch (err) {
			console.warn("Redis GET error (getById):", err);
		}

		const user = await getUserById(id);

		if (user) {
			try {
				await redis.set(key, JSON.stringify(user), "EX", 60);
			} catch (err) {
				console.warn("Redis SET error (getById):", err);
			}
		}
		return user;
	}

	async getByEmail(email: string) {
		const key = `user:email:${email}`;
		try {
			const cached = await redis.get(key);
			if (cached) {
				console.log("Cache hit for user:", email);
				return JSON.parse(cached);
			}
		} catch (err) {
			console.warn("Redis GET error (getByEmail):", err);
		}

		const user = await getUserByEmail(email);

		if (user) {
			try {
				await redis.set(key, JSON.stringify(user), "EX", 60);
			} catch (err) {
				console.warn("Redis SET error (getByEmail):", err);
			}
		}
		return user;
	}

	async clear(id: string, email?: string) {
		const tasks = [`user:id:${id}`];
		if (email) tasks.push(`user:email:${email}`);
		try {
			await redis.del(...tasks);
		} catch (err) {
			console.warn("Redis DEL error (clear):", err);
		}
	}
}
