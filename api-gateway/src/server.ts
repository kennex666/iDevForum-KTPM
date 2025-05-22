import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from 'cors';
import { authenticate } from "./middlewares/authenticate";
import conditionalAuthenticate from "./middlewares/conditionalAuthenticate";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = 3000;

app.use(cors());

// Nếu muốn giới hạn origin:
app.use(cors({
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true
}));

// Giới hạn 5 request/phút cho mỗi IP đến comment-service
const commentLimiter = rateLimit({
  windowMs: 60000,
  max: 15,
  message: { 
	errorCode: 429,
	errorMessage: "Bạn đang thao tác quá nhanh, vui lòng thử lại sau 1 phút",}
});

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
	"/api/post/search",
	createProxyMiddleware({
		target: "http://post-service:3002/posts/search",
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
	commentLimiter, // Đặt trước proxy
	conditionalAuthenticate(["POST", "PUT", "DELETE"]),
	createProxyMiddleware({
		target: "http://comment-service:3001",
		changeOrigin: true,
	})
);


app.use(
	"/api/reaction",
	conditionalAuthenticate(["POST", "PUT", "DELETE"]),
	createProxyMiddleware({
		target: "http://comment-service:3001/reaction",
		changeOrigin: true
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
  '/uploads',
  createProxyMiddleware({
    target: 'http://file-service:3003',
    changeOrigin: true,
    pathRewrite: { '^/uploads': '/uploads' }
  })
);

app.use(
	"/api/thirdparty",
	conditionalAuthenticate(["POST"]),
	createProxyMiddleware({
		target: "http://third-party-service:3004",
		changeOrigin: true,
	})
)

app.use(
	"/api/postreport",
	conditionalAuthenticate(["GET","POST", "PUT", "DELETE"]),
	createProxyMiddleware({
		target: "http://postreport-service:3007/postreports",
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
