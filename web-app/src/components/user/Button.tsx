"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	variant?: "ghost" | "default";
}

export function Button({
	children,
	variant = "default",
	...props
}: ButtonProps) {
	return (
		<button
			{...props}
			className={`px-4 py-2 rounded font-semibold transition ${
				variant === "ghost"
					? "text-gray-600 hover:text-black"
					: "bg-black text-white hover:bg-gray-800"
			}`}
		>
			{children}
		</button>
	);
}
