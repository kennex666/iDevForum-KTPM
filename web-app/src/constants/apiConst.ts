import path from "path";

export const apiDevelopment = {
	domain: {
		client: "localhost:3000",
		server: "api-gateway:3000",
	},
	protocol: "http",
	apiPath: {
		base: "/api",
		auth: {
			login: "/auth/login",
			register: "/auth/register",
			logout: "/auth/logout",
			refresh: "/auth/refresh",
			queryMe: "/auth/me",
		},
		user: {
			getAll: "/user/getall",
			get: "/user/profile/:id",
			getFollowerProfile: "/user/action/follower",
			update: "/user/profile/:id",
			updateNew: "/user/updateUserProfile",
			delete: "/user/profile/:id",
			updatePassword: "/user/updatepassword",
			createByAdmin: "/user/createUserByAdmin",
		},
		userAction: {
			follow: "/user/action/follow/:id",
		},
		post: {
			getAll: "/post",
			getInfo: "/post/:id",
			updateStatus: "/post/admin",
			getAuthor: "/post/author/",
			getBookmark: "/post/bookmark/",
			actionBookmark: "/post/actionBookmark",
			search: "/post/search",
		},
		postReport: {
			getAll: "/postreport",
			getInfo: "/postreport/:id",
			create: "/postreport/save",
			update: "/postreport",
			delete: "/postreport/:id",
			search: "/postreport/search",
		},
		comment: "/comment",
		commentNew: {
			create: "/comment/save",
			getCommentViaPost: "/comment/post/",
			delete: "/comment/",
		},
		like: "/like",
		topic: "/topic",
		reaction: {
			action: "/reaction/action/",
			getAllViaUser: "/reaction/getAllViaUser/",
			getAllViaPost: "/reaction/getAllViaPost/",
		},
		upload: {
			uploadImage: "/file/image",
		},
		thirdparty: {
			ask: "/thirdparty/ask",
		},
	},
};

export const apiProduction = {
	...apiDevelopment,
	domain: {
		client: "idev4rum.pj.io.vn/api-gateway",
		server: "idev4rum.pj.io.vn/api-gateway",
	},
	protocol: "https",
};


export const api = process.env.NODE_ENV == "development" ? apiDevelopment : apiProduction;

export const apiParser = (apiPath: string, env: "client" | "server" = "client"): any => {
	const domain = api.domain[(env || "client") as keyof typeof api.domain] || api.domain.client;
	return `${api.protocol}://${domain}${api.apiPath.base}${apiPath}`;
};