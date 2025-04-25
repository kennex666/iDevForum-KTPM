"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Home() {

	const { user } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.replace("/home");
		} else {
			router.replace("/login");
		}
	}, [user]);

	return (
		<div className="flex flex-row min-h-screen">
			{/* Waiting for auth */}
			<div className="flex flex-col items-center justify-center w-full">
				<Image
					src="/images/logo.png"
					alt="Logo"
					width={200}
					height={200}
					className="mb-4"
				/>
				<p className="text-lg text-gray-700">
					Đang kiểm tra thông tin đăng nhập...
				</p>
				<p className="text-lg text-gray-700">
					Vui lòng đợi trong giây lát...
				</p>
			</div>
		</div>
	);
}
