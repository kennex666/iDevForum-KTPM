import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from 'cors';
import { authenticate } from "./middlewares/authenticate";
import conditionalAuthenticate from "./middlewares/conditionalAuthenticate";

const app = express();
const PORT = 3000;

app.use(cors());

// Nếu muốn giới hạn origin:
app.use(cors({
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true
}));

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
	conditionalAuthenticate(["POST", "PUT", "DELETE"]),
	createProxyMiddleware({
		target: "http://post-service:3002/posts",
		changeOrigin: true,
	})
);
app.use(
	"/api/topic",
	createProxyMiddleware({
		target: "http://post-service:3002/topics",
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
	})
);
app.use(
	"/api/reaction",
	createProxyMiddleware({
		target: "http://reaction-service:3004",
		changeOrigin: true,
	})
);

app.use(
	"/api/postreport",
	conditionalAuthenticate(["GET","POST", "PUT", "DELETE"]),
	createProxyMiddleware({
		target: "http://postreport-service:3007/postreports",
		changeOrigin: true,
	})
);
app.use(
	"/api/bookmark",
	conditionalAuthenticate(["GET","POST", "PUT", "DELETE"]),
	createProxyMiddleware({
		target: "http://bookmark-service:3008/bookmarks",
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
