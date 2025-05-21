"use client";
import { getAccessToken } from "@/app/utils/cookiesParse";
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
	_id: "",
	email: "no-login@localhost.com",
	name: "Guest",
	role: EUserRole.GUEST,
	accountState: "ACTIVE",
	coverPicture: "https://picsum.photos/1000/300",
	description:
		"Xin chào, mình là Bảo. Mình yêu thích công nghệ và luôn sẵn sàng học hỏi, chia sẻ!",
	username: "no-login@" + Math.random().toString(36).substring(2, 7),
	title: "",
	profilePicture: "/assets/img/avt-default.png",
	bio: "Một người thích chia sẻ kiến thức và yêu công nghệ.",
	createdAt: new Date(),
	updatedAt: new Date(),
	bookmarks: [],
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState(guestUser);
	const [isLogin, setIsLogin] = useState(false);
	const [isUserReady, setIsUserReady] = useState(false); // ✅ NEW

	useEffect(() => {
		const fetchUser = async () => {
			const token = getAccessToken();
			if (!token) {
				setIsUserReady(true); // ✅ Không có token vẫn báo đã xong
				return;
			}
			try {
				const res = await fetch(apiParser(api.apiPath.auth.queryMe), {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await res.json();
				if (data?.data) {
					setUser(data.data);
					setIsLogin(true);
				} else {
					setUser((pre) => ({ ...pre, _id: "guest" }));
				}
			} catch (err) {
				console.error("Lỗi fetch user:", err);
				setUser((pre) => ({ ...pre, _id: "guest" }));
			} finally {
				setIsUserReady(true); // ✅ Báo đã xong sau khi fetch
			}
		};
		fetchUser();
	}, []);

	return (
		<UserContext.Provider
			value={{ user, setUser, isLogin, setIsLogin, isUserReady }}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
