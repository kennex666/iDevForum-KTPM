// redisClient.ts
import Redis from "ioredis";

export const redis = new Redis({
	host: process.env.REDIS_HOST || "redis", // nội bộ docker
	port: 6379,
});
