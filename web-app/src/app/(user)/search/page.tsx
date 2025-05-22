"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostList from "@/components/user/PostList";
import { api, apiParser } from "@/constants/apiConst";
import axios from "axios";
import Sidebar from "@/components/user/sidebar/Sidebar";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Tìm kiếm bài viết theo tên chủ đề
    // const searchByTopicName = async (topicName: string) => {
    //     const topicRes = await fetch("http://localhost:3000/api/topic/search", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ name: topicName }),
    //     });
    //     const topicData = await topicRes.json();
    //     if (!topicData.data || topicData.data.length === 0) return [];
    //     const tagIds = topicData.data.map((topic: any) => topic.tagId);
    //     const postRes = await fetch("http://localhost:3000/api/post/search", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ tagId: tagIds.length === 1 ? tagIds[0] : tagIds }),
    //     });
    //     const postData = await postRes.json();
    //     return postData.data || [];
    // };

	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);

	const fetchPosts = async () => {

		const res = await axios.post(
			apiParser(api.apiPath.post.search) + `?offset=${currentPage * 10}`,
			{
				title: q, content: q, description: q
			},
		);

		const data = await res.data;
		if (data?.data) {
			setPosts(data.data);
			setTotal(data.total);
            setLoading(false);
		} else {
			console.error("Error fetching posts:", data);
            setLoading(false);
		}
	};

	useEffect(() => {
        if (q)
		    fetchPosts();
	}, [currentPage, q]);

	const action = {
		prev: () => {
			if (currentPage > 0) {
				setCurrentPage(currentPage - 1);
                setLoading(true);
			}
		},
		next: () => {
			if (currentPage < Math.floor(total / 10)) {
				setCurrentPage(currentPage + 1);
                setLoading(true);
			}
		},
	};

    return (
		<div>
			{/* Main content */}
			<div className="container mx-auto px-12 lg:w-10/12">
				<div className="flex justify-between items-start pt-12">
					{/* Left: Posts */}
					<div className="w-2/3">
						<div className="flex flex-col justify-center px-5 space-y-8">
							<div className="flex flex-row items-center justify-start">
								<h2 className="text-4xl text-gray-500">
									Tìm kiếm cho{" "}
									<span className="text-black">{q}</span>
								</h2>
							</div>
						</div>
						<div className="flex flex-row space-x-10 items-center text-nowrap scrollbar-custom px-5 mt-7 mb-6">
							<a
								className="pb-3 border-black border-b-2"
								href="#"
							>
								Bài viết
							</a>
							<a
								className="pb-3 text-gray-500 hover:text-black"
								href="#"
							>
								Tác giả
							</a>
						</div>
						{/* Post list */}
						{posts.length == 0 ? (
							<div className="flex flex-col items-center space-y-4">
								<h2 className="text-2xl font-semibold">
									Không có bài viết nào
								</h2>
								<p
									onClick={() => {
										if (!q) return;
										window.location.href = `/search-ai?q=${encodeURIComponent(
											q
										)}`;
									}}
									className="text-blue-500 text-center hover:underline cursor-pointer"
								>
									Bạn có muốn thử AI content? Click vào đây
								</p>
							</div>
						) : 
						(<PostList
							posts={posts}
							total={total}
							action={action}
							currentPage={currentPage}
						/>)}
					</div>
					{/* Right: Sidebar */}
					<Sidebar />
				</div>
			</div>
		</div>
	);
}