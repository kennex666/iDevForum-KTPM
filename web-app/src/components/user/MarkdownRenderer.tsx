"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";

interface Props {
	content: string;
}

const markdownStyles: Record<string, string[]> = {
	h1: ["text-2xl", "font-bold", "mt-6", "mb-4"],
	h2: ["text-xl", "font-semibold", "mt-5", "mb-3"],
	h3: ["text-lg", "font-medium", "mt-4", "mb-2"],
	p: ["text-base", "text-gray-700", "mt-2", "mb-4", "leading-relaxed"],
	ul: ["list-disc", "list-inside", "pl-5", "mt-2", "mb-4"],
	ol: ["list-decimal", "list-inside", "pl-5", "mt-2", "mb-4"],
	li: ["text-gray-700", "mb-2"],
	a: ["text-blue-500", "hover:underline"],
	code: ["text-red-600", "font-mono", "px-1", "py-0.5", "rounded"],
	pre: ["bg-gray-100", "p-4", "rounded-md", "overflow-x-auto", "my-4"],
	blockquote: [
		"border-l-4",
		"border-blue-300",
		"pl-4",
		"italic",
		"text-gray-600",
		"my-4",
	],
};

const applyMarkdownStyles = (el: HTMLElement) => {
	for (const [selector, classList] of Object.entries(markdownStyles)) {
		el.querySelectorAll(selector).forEach((element) => {
			element.classList.add(...classList);
		});
	}
};

export default function MarkdownRenderer({ content }: Props) {
	const [html, setHtml] = useState<string>("");

	useEffect(() => {
		const updateHtml = async () => {
			const rawHtml = await marked.parse(content || "");
			const container = document.createElement("div");
			container.innerHTML = rawHtml;
			applyMarkdownStyles(container);
			setHtml(container.innerHTML);
		};
	
		updateHtml();
	}, [content]);

	return (
		<div
			className="markdown mt-6 container flex flex-col gap-1"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
