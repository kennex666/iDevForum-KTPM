import Navbar from "@/components/user/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "iDev4rum",
	description: "Diễn đàn lập trình viên IUH",
};

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
