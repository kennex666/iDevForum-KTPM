"use client";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser,guestUser } from "@/context/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const {user, isUserReady, isLogin } = useUser();
  useEffect(() => {
    if (!isUserReady) return;
		if (!isLogin) {
			router.push("/login");
		} else if (user.role !== 1) {
			router.push("/");
		}
  }, [isUserReady, router]);
  return (
		<>
			{!isUserReady && (
				<div className="flex justify-center items-center h-screen">
					Loading...
				</div>
			)}
			{isUserReady && user.role == 1 && (
        <>
			<>
				{/* Bootstrap CSS */}
				<link
					rel="stylesheet"
					href="/assets/bootstrap/css/bootstrap.min.css"
				/>

				{/* Google Fonts */}
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap"
				/>

				{/* Font Awesome */}
				<link
					rel="stylesheet"
					href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"
				/>
			</>
			<>
				<div className="flex">
					<Sidebar />
					<div className="flex-grow">
						<Navbar user={user} />
						<main>{children}</main>
					</div>
				</div>
			</> </>
			)}
		</>
  );
}