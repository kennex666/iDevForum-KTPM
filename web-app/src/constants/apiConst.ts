import path from "path";

export const apiDevelopment = {
    domain: "localhost:3000",
    protocol: "http",
    apiPath: {
        base: "/api/v1",
        auth: "/auth",
        user: "/user",
        post: "/post",
        comment: "/comment",
        like: "/like",
    }
}

export const apiProduction = {
    domain: "api.example.com",
    protocol: "https",
    apiPath: {
        base: "/api/v1",
        auth: "/auth",
        user: "/user",
        post: "/post",
        comment: "/comment",
        like: "/like",
    }
}

export const api = process.env.NODE_ENV == "development" ? apiDevelopment : apiProduction;

export const apiParser = (apiPath: string): any => {
	return `${api.protocol}://${api.domain}${apiPath}`;
};