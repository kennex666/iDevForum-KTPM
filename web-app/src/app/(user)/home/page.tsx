"use client";
import Navbar from "@/components/user/Navbar";
import PostList from "@/components/user/PostList";
import Sidebar from "@/components/user/sidebar/Sidebar";
import TabBar from "@/components/user/TabBar";
import { api, apiParser } from "@/constants/apiConst";
import { useUser } from "@/context/UserContext";
import { Post } from "@/interfaces/Post";
import axios from "axios";
import { use, useEffect, useState } from "react";



export default function HomePage() {
	const activeTab = "home"; // lấy từ query nếu cần
	// const posts = [ 
	// 	{
	// 		title: "Giới thiệu về Java",
	// 		description: "Java là một ngôn ngữ lập trình hướng đối tượng, được phát triển bởi Sun Microsystems.",
	// 		topic: { tagId: "java", name: "Java" },
	// 			date: "2023-04-17",
	// 			totalUpVote: 100,
	// 			totalComments: 50,
	// 			url: "gioi-thieu-ve-java",
			
	// 		author: {
	// 			userId: "123",
	// 			name: "Duong Thai Bao",
	// 			profilePicture: "https://placehold.co/40x40",
	// 		},
	// 	},
	// ] as Post[]; // fetch từ API hoặc mock
	const { user } = useUser();

	const [	posts, setPosts ] = useState<any>([]);
	const [ total, setTotal ] = useState(0);
	const [ currentPage, setCurrentPage ] = useState(0);
	
	const fetchPosts = async () => {
		const params: Record<string, any> = {};

		params.sort = -1;

		if (activeTab !== "home") {
			params.topicId = activeTab; // hoặc topicId ?? undefined để tránh null
		}
		const res = await axios.get(apiParser(api.apiPath.post.getAll) + `?offset=${currentPage * 10}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.accessToken}`,
			},
			params,
		});

		const data = await res.data;
		if (data?.data) {
			setPosts(data.data);
			setTotal(data.total);
		} else {
			console.error("Error fetching posts:", data);
		}
	};
	
	useEffect(() => {
		fetchPosts();
	}, [activeTab, currentPage]);

	const action = {
		prev: () => {
			if (currentPage > 0) {
				setCurrentPage(currentPage - 1);
			}
		},
		next: () => {
			if (currentPage < Math.floor(total / 10)) {
				setCurrentPage(currentPage + 1);
			}
		},
	};

	

	// Giả bộ user:
	// const user = {
	// 	bookMarks: [
	// 		{
	// 			post: {
	// 				title: "Giới thiệu về Java",
	// 				description:
	// 					"Java là một ngôn ngữ lập trình hướng đối tượng, được phát triển bởi Sun Microsystems.",
	// 				topic: { tagId: "java", name: "Java" },
	// 				date: "2023-04-17",
	// 				totalUpVote: 100,
	// 				totalComments: 50,
	// 				url: "gioi-thieu-ve-java",

	// 				author: {
	// 					userId: "123",
	// 					name: "Duong Thai Bao",
	// 					profilePicture: "https://placehold.co/40x40",
	// 				},
	// 			},
	// 		},
	// 	],
	// };

	return (
		<>
			<div className="container mx-auto px-12 lg:w-10/12">
				<div className="flex justify-between items-start py-4">
					<div className="w-2/3 space-y-8">
						<TabBar activeTab={activeTab} />
						<PostList posts={posts} total={total} action={action} currentPage={currentPage} />
						{/* Phân trang nếu cần */}
					</div>
					<Sidebar currentUser={user} />
				</div>
			</div>
		</>
	);
}


