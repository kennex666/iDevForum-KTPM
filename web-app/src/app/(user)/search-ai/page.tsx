"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostList from "@/components/user/PostList";
import { api, apiParser } from "@/constants/apiConst";
import axios from "axios";
import Sidebar from "@/components/user/sidebar/Sidebar";
import MarkdownRenderer from "@/components/user/MarkdownRenderer";
import DOMPurify from 'dompurify';
import Toast from "@/components/Toast";

export default function SearchAIPage() {
	const searchParams = useSearchParams();
	const q = searchParams.get("q") || "";
	const [posts, setPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	// Toát
	const [toastType, setToastType] = useState("error");
	const [showToast, setShowToast] = useState("");

	// http://localhost:3000/api/thirdparty/ask
	useEffect(() => {
		if (!q) return;

		const fetchAIContent = async () => {
			setLoading(true);
			try {
				const response = await axios.post(
					`${apiParser(api.apiPath.thirdparty.ask)}`,
					{
						prompt: q,
					}
				);
				const reply =
					response.data.reply || "Không có nội dung phù hợp.";
				setPosts([{ content: reply }]); // nếu muốn dùng PostList sau này
				setToastType("success");
				setShowToast("Nội dung của bạn đã sẵn sàng!");
			} catch (error: any) {
				const message =
					error?.response?.data?.error ||
					"Lỗi không xác định từ server.";
				setToastType("error");
				setShowToast("❌ Lỗi AI: " + message);
			} finally {
				setLoading(false);
			}
		};

		fetchAIContent();
	}, [q]);
	return (
		<div>
			{showToast && (
				<Toast
					message={showToast}
					type={(toastType as any) || "error"}
				/>
			)}
			{/* Main content */}
			<div className="container mx-auto px-12 lg:w-10/12">
				<div className="flex justify-between items-start pt-12">
					{/* Left: Posts */}
					<div className="w-2/3">
						<div className="flex flex-col justify-center space-y-8">
							<div className="flex flex-row items-center justify-start">
								<h2 className="text-4xl text-gray-500">
									Tìm kiếm cho{" "}
									<span className="text-black">{q}</span>
								</h2>
							</div>
						</div>
						<div className="flex flex-row space-x-10 items-center text-nowrap scrollbar-custom mt-7 mb-6">
							<a
								className="pb-3 border-black border-b-2"
								href="#"
							>
								AI Content
							</a>
						</div>
						{/* Post list */}
						<div>
							{loading ? (
								<div className="flex items-center space-x-3 mt-6">
									<svg
										className="animate-spin h-6 w-6 text-blue-500"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
										></path>
									</svg>
									<p className="text-gray-600 text-lg italic animate-pulse">
										Chờ chút,{" "}
										<span className="text-black font-semibold">
											iDev-AI
										</span>{" "}
										đang tìm kiếm nội dung cho bạn...
									</p>
								</div>
							) : posts.length > 0 ? (
								<MarkdownRenderer
									content={DOMPurify.sanitize(
										posts[0].content
									)}
								/>
							) : (
								<h2 className="text-xl">
									Xin lỗi, nội dung không khả dụng ngay lúc
									này!
								</h2>
							)}
						</div>
					</div>
					{/* Right: Sidebar */}
					<Sidebar />
				</div>
			</div>
		</div>
	);
}
