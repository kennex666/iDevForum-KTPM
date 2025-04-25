"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="vi"
			className={`${geistSans.variable} ${geistMono.variable}`}
		>
			<body>
				<UserProvider>{children}</UserProvider>
			</body>
		</html>
	);
}
