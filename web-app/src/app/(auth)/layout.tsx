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
	return <div className="flex flex-row min-h-full">{children}</div>;
}
