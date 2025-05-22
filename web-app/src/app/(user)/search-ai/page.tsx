"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostList from "@/components/user/PostList";
import { api, apiParser } from "@/constants/apiConst";
import axios from "axios";
import Sidebar from "@/components/user/sidebar/Sidebar";
import MarkdownRenderer from "@/components/user/MarkdownRenderer";
import DOMPurify from 'dompurify';

export default function SearchAIPage() {
	const searchParams = useSearchParams();
	const q = searchParams.get("q") || "";
	const [posts, setPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);

    

	return (
		<div>
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
							<MarkdownRenderer
								content={DOMPurify.sanitize("TEST")}
							/>
						</div>
					</div>
					{/* Right: Sidebar */}
					<Sidebar />
				</div>
			</div>
		</div>
	);
}
