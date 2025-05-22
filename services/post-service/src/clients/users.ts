import axios, { AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import Bottleneck from "bottleneck";
import CircuitBreaker from "opossum";

// Limiter: giới hạn concurrent requests
const limiter = new Bottleneck({
	maxConcurrent: 5, // Tối đa 5 task đồng thời
	minTime: 200, // 200ms giữa các request
	reservoir: 100, // chỉ cho tổng cộng 100 request trong 1 chu kì
	reservoirRefreshAmount: 100, // reset thì nạp lại 100 request cho reservoir
	reservoirRefreshInterval: 60000, // Thời gian refresh reservoir: 60s
});


const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://api-gateway:3000/api/user";

// Khi có request bị queued
limiter.on("queued", (info) => {
	console.warn("🚨 Request queued! Rate limit reached or concurrency full!");
	console.log("Current queued jobs:", limiter.jobs("QUEUED").length);
});

// Khi tất cả request hoàn thành
limiter.on("idle", () => {
	console.info("✅ Limiter idle - no pending request.");
});
const requestWithRetry = async (
	requestFn: () => Promise<any>,
	retries = 5
): Promise<any> => {
	let lastError;
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			console.log(`🔁 Attempt ${attempt}`);
			return await requestFn();
		} catch (error) {
			lastError = error;
			console.warn(`❌ Failed at attempt ${attempt}: ${error.message}`);
			if (attempt < retries) {
				const wait = 1000 * attempt; // exponential backoff
				await new Promise((res) => setTimeout(res, wait));
			}
		}
	}
	throw lastError;
};

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

// Retry: tự động gửi lại khi lỗi mạng, lỗi server
axiosRetry(userAxios, {
    retries: 5,
	retryDelay: (retryCount) => {
		console.log(`⏳ Retry attempt #${retryCount}`);
		return axiosRetry.exponentialDelay(retryCount);
	},
    retryCondition: (error) => {
		console.log("Retry...");
		return true; // retry tất cả lỗi
	},
});

const createSafeCaller = (axiosInstance: typeof axios) => {
	const breaker = new CircuitBreaker(
		(config: AxiosRequestConfig) =>
			requestWithRetry(
				() => limiter.schedule(() => axiosInstance.request(config)),
				5 // số lần retry
			),
		circuitBreakerOptions
	);

	breaker.on("open", () => console.warn("🚨 Breaker opened"));
	breaker.on("halfOpen", () => console.info("⏳ Breaker half-open"));
	breaker.on("close", () => console.info("✅ Breaker closed"));

	return (config: AxiosRequestConfig) => breaker.fire(config);
};


const safeUserAxios = createSafeCaller(userAxios as any);


export const UserClient = {
    getUserById: async (userId: string) => {
        try {
			// const response = await axios.get(`${USER_SERVICE_URL}/profile/${userId}`);
			// return response.data;
			const response = await safeUserAxios({
				method: "GET",
				url: `/profile/${userId}`,
			});
			return response.data;
        } catch (error) {
            throw error;
        }
    },
	getFollowingUserIds: async (token: string) => {
		try {
			const response = await axios.get(
				`${USER_SERVICE_URL}/action/follower-details`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data; // .data sẽ là { errorCode, errorMessage, data: [userIds] }
		} catch (error) {
			console.error("Error fetching following user IDs:", error);
			throw error;
		}
	},
};
