"use client";
import { api, apiParser } from "@/constants/apiConst";
import { Bookmark } from "@/interfaces/Sidebar";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export enum EUserRole {
	ADMIN = 1,
	USER = 0,
	GUEST = -1
}

export interface IUser {
	email: string;
	name?: string;
	role: EUserRole;
	accountState?: string;
	coverPicture?: string;
	description?: string;
	username?: string;
	title?: string;
	profilePicture?: string;
	bio?: string;
	createdAt?: Date;
	updatedAt?: Date;
	bookmarks?: Bookmark[];
}

export const guestUser = {
	email: "no-login@localhost.com",
	name: "Guest",
	role: EUserRole.GUEST,
	accountState: "ACTIVE",
	coverPicture: "https://picsum.photos/1000/300",
	description: "Xin chào, mình là Bảo. Mình yêu thích công nghệ và luôn sẵn sàng học hỏi, chia sẻ!",
	username: "no-login@" + Math.random().toString(36).substring(2, 7),
	title: "",
	profilePicture: "/assets/img/avt-default.png",
	bio:  "Một người thích chia sẻ kiến thức và yêu công nghệ.",
	createdAt: new Date(),
	updatedAt: new Date(),
	bookmarks: [],
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

	const [user, setUser] = useState(guestUser);

	const [isLogin, setIsLogin] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("accessToken="))
				?.split("=")[1];
			if (!token) return;

			try {
				const res = await fetch(apiParser(api.apiPath.auth.queryMe),
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const data = await res.json();
				if (data?.data) {
					setUser(data.data);
					console.log("User data:", data.data);
					setIsLogin(true);
				}
			} catch (err) {
				console.error("Lỗi fetch user:", err);
			}
		};
		fetchUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser, isLogin, setIsLogin }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
