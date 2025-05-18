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
		user: "/user",
		post: {
			getAll: "/post",
			getInfo: "/post/:id",
			updateStatus: "/post/admin",
		},
		postReport: {
			//http://localhost:3000/api/postreport/
			getAll: "/postreport",
			getInfo: "/postreport/:id",
			create: "/postreport/save",
			update: "/postreport/:id",
			delete: "/postreport/:id",
			search: "/postreport/search",
		},
		comment: "/comment",
		like: "/like",
	},
};

export const apiProduction = apiDevelopment;


export const api = process.env.NODE_ENV == "development" ? apiDevelopment : apiProduction;

export const apiParser = (apiPath: string, env: "client" | "server" = "client"): any => {
	const domain = api.domain[(env || "client") as keyof typeof api.domain] || api.domain.client;
	return `${api.protocol}://${domain}${api.apiPath.base}${apiPath}`;
};