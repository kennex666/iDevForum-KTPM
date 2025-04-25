"use client";

import Navbar from "@/components/user/Navbar";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar />
			<div className="container mx-auto px-12 lg:w-10/12">{children}</div>
		</>
	);
}
