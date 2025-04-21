"use client";
import Sidebar from "@/components/admin/Sidebar";

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <>
            <div className="flex flex-row w-full h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-grow flex flex-col overflow-hidden">
                    <div className="flex-grow overflow-auto">{children}</div>
                </div>
            </div>
        </>
    );
}
