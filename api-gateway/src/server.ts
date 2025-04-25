import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authenticate } from "./middlewares/authenticate";
import conditionalAuthenticate from "./middlewares/conditionalAuthenticate";

const app = express();
const PORT = 3000;

// Proxy config
app.use(
	"/api/auth",
	createProxyMiddleware({
		target: "http://authenticate-service:3005",
		changeOrigin: true,
	})
);
app.use(
	"/api/user",
	createProxyMiddleware({
		target: "http://user-service:3006",
		changeOrigin: true,
	})
);
app.use(
	"/api/post",
	createProxyMiddleware({
		target: "http://post-service:3002",
		changeOrigin: true,
	})
);
app.use(
	"/api/comment",
	conditionalAuthenticate(["POST", "PUT", "DELETE"]),
	createProxyMiddleware({
		target: "http://comment-service:3001",
		changeOrigin: true,
		on: {proxyReq: (proxyReq, req) => {
			if (req.user) {
				proxyReq.setHeader("user", JSON.stringify(req.user));
			}
		}},
	})
);

app.use(
	"/api/file",
	conditionalAuthenticate(["POST", "PUT", "DELETE"]),
	createProxyMiddleware({
		target: "http://file-service:3003",
		changeOrigin: true,
		on: {proxyReq: (proxyReq, req) => {
			if (req.user) {
				proxyReq.setHeader("user", JSON.stringify(req.user));
			}
		}},
	})
);
app.use(
	"/api/reaction",
	createProxyMiddleware({
		target: "http://reaction-service:3004",
		changeOrigin: true,
	})
);

// Health check
app.get("/", (_req, res) => {
	res.send("API Gateway is running...");
});

app.listen(PORT, () => {
	console.log(`API Gateway listening on port ${PORT}`);
});
