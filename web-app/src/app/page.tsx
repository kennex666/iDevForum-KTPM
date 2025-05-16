"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Home() {

	const { user } = useUser();
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			if (user) {
				router.replace("/home");
			} else {
				router.replace("/login");
			}
		}, 1500);
	}, [user]);

	return (
		<div className="flex flex-row min-h-screen">
			{/* Waiting for auth */}
			<div className="flex flex-col items-center justify-center w-full">
				<Image
					src="/assets/img/idev-loading.gif"
					alt="Logo"
					width={300}
					height={300}
					className="mb-4"
				/>
			</div>
		</div>
	);
}
