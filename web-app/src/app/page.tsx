'use client';
import { api, apiParser } from "@/constants/apiConst";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { queryMe } from '../../../services/authenticate-service/src/controllers/authController';

export default function Home() {
	const [isLogin, setIsLogin] = useState(false);

	const checkLogin = async () => {
		try {
			const accessToken = document.cookie
				.split("; ")
				.find((row) => row.startsWith("accessToken="))
				?.split("=")[1];

			const result = await fetch(apiParser(api.apiPath.auth.queryMe), {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});
			const data = await result.json();
			if (!data){
				setIsLogin(false);
				// Redirect to login page if access token is invalid
				window.location.href = "/login";
			} else {
				if (data.errorCode != 200) {
					setIsLogin(false);
					// Redirect to login page if access token is invalid
					window.location.href = "/login";
					return;
				}
				if (data?.data) {
					setIsLogin(true);
					// Redirect to home page if access token exists
					window.location.href = "/home";
					return;
				}
			}
			// remove token cookies
			document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			setIsLogin(false);
			// Redirect to login page if access token is invalid
			window.location.href = "/login";
		} catch (error) {
			console.error("Đã xảy ra lỗi:", error);
			setIsLogin(false);
			// Redirect to login page if access token is invalid
			window.location.href = "/login";
		}
	}

	useEffect(() => {
		checkLogin();
	}, []);
	return (
		<div className="flex flex-row min-h-screen">
			{/* Waiting for authen */}
			<div className="flex flex-col items-center justify-center w-full">
				<Image
					src="/images/logo.png"
					alt="Logo"
					width={200}
					height={200}
					className="mb-4"
				/>
				<p className="text-lg text-gray-700">Đang kiểm tra thông tin đăng nhập...</p>
				<p className="text-lg text-gray-700">Vui lòng đợi trong giây lát...</p>
			</div>
		</div>
	);
}
