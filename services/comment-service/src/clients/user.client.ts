
import axios, { AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import Bottleneck from "bottleneck";
import CircuitBreaker from "opossum";

// Limiter: giới hạn concurrent requests
const limiter = new Bottleneck({
	maxConcurrent: 5,
	minTime: 200, // 200ms giữa các request
	reservoir: 100, // chỉ cho tổng cộng 100 request trong 1 chu kì
	reservoirRefreshAmount: 100, // reset thì nạp lại 100 request cho reservoir
	reservoirRefreshInterval: 30000, // Thời gian refresh reservoir: 30s
});

const POST_SERVICE_URL = process.env.POST_SERVICE_URL || "http://post-service:3002";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://user-service:3006";

const RETRY_TIME = 3;

// Khi có request bị queued
limiter.on("queued", (info) => {
	console.warn("🚨 Request queued! Rate limit reached or concurrency full!");
	console.log("Current queued jobs:", limiter.jobs("QUEUED").length);
});

// Khi tất cả request hoàn thành
limiter.on("idle", () => {
	console.info("✅ Limiter idle - no pending request.");
});

// Breaker config
const circuitBreakerOptions: CircuitBreaker.Options = {
	timeout: 10000, // request quá 10000ms sẽ bị coi là lỗi
	errorThresholdPercentage: 66, // 66% request bị lỗi trong 10s sẽ mở breaker
	resetTimeout: 10000, // 10s sau sẽ thử lại
	rollingCountTimeout: 10000, // 10s sau sẽ reset lại số request
};

const userAxios = axios.create({
	baseURL: USER_SERVICE_URL,
	timeout: 3000,
});


const postAxios = axios.create({
	baseURL: POST_SERVICE_URL,
	timeout: 3000,
});

// Retry: tự động gửi lại khi lỗi mạng, lỗi server
axiosRetry(userAxios, {
	retries: RETRY_TIME,
	retryDelay: axiosRetry.exponentialDelay,
	retryCondition: (error) => {
		return axiosRetry.isNetworkOrIdempotentRequestError(error);
	},
});

// Retry: tự động gửi lại khi lỗi mạng, lỗi server
axiosRetry(postAxios, {
	retries: RETRY_TIME,
	retryDelay: axiosRetry.exponentialDelay,
	retryCondition: (error) => {
		return axiosRetry.isNetworkOrIdempotentRequestError(error);
	},
});

const createSafeCaller = (axiosInstance: typeof axios) => {
	const breaker = new CircuitBreaker(
		(config: AxiosRequestConfig) =>
			limiter.schedule(() => axiosInstance.request(config)),
		circuitBreakerOptions
	);

	// Log trạng thái breaker
	breaker.on("open", () => console.warn("🚨 Breaker opened"));
	breaker.on("halfOpen", () => console.info("⏳ Breaker half-open"));
	breaker.on("close", () => console.info("✅ Breaker closed"));

	return (config: AxiosRequestConfig) => breaker.fire(config);
};

const safeUserCall = createSafeCaller(userAxios as any);
const safePostCall = createSafeCaller(postAxios as any);

export const userClient = {
	async getUserById(userId: string) {
		try {
			const response = await safeUserCall({
				method: "GET",
				url: `/profile/${userId}`,
			});
			if (!response.data) return null;
			return response.data.data;
		} catch (error) {
			throw new Error("Failed to fetch user data");
		}
	},
};

export const postClient = {
	async getPostById(postId: string) {
		try {
			const response = await safePostCall({
				method: "GET",
				url: `/posts/${postId}`,
			});
			if (!response.data) return null;
			return response.data;
		} catch (error) {
			throw new Error("Failed to fetch post data");
		}
	},
};
