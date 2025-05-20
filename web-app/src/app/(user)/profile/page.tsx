"use client";

import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/user/MarkdownRenderer";
import PostList from "@/components/user/PostList";
import { guestUser, useUser } from "@/context/UserContext";
import { Post } from "@/interfaces/Post";
import { useEffect, useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import DOMPurify from 'dompurify';
import { api, apiParser } from "@/constants/apiConst";
import axios from "axios";


export default function MyProfileHome() {
	const profile = guestUser;
    const {user, isLogin} = useUser();
    const [active, setActive] = useState("home");

	// const posts = [
	// 	{
	// 		title: "Giới thiệu về Java",
	// 		description:
	// 			"Java là một ngôn ngữ lập trình hướng đối tượng, được phát triển bởi Sun Microsystems.",
	// 		topic: { tagId: "java", name: "Java" },
	// 		date: "2023-04-17",
	// 		totalUpVote: 100,
	// 		totalComments: 50,
	// 		url: "gioi-thieu-ve-java",

	// 		author: {
	// 			userId: "123",
	// 			name: "Duong Thai Bao",
	// 			profilePicture: "https://placehold.co/40x40",
	// 		},
	// 	},
	// 	{
	// 		title: "Giới thiệu về Java",
	// 		description:
	// 			"Java là một ngôn ngữ lập trình hướng đối tượng, được phát triển bởi Sun Microsystems.",
	// 		topic: { tagId: "java", name: "Java" },
	// 		date: "2023-04-17",
	// 		totalUpVote: 100,
	// 		totalComments: 50,
	// 		url: "gioi-thieu-ve-java",

	// 		author: {
	// 			userId: "123",
	// 			name: "Duong Thai Bao",
	// 			profilePicture: "https://placehold.co/40x40",
	// 		},
	// 	},
	// ] as Post[]; // fetch từ API hoặc mock

	const [posts, setPosts] = useState<Post[]>([]);
		const [total, setTotal] = useState(0);
		const [currentPage, setCurrentPage] = useState(0);

		const fetchPosts = async () => {
			const params: Record<string, any> = {};

			params.sort = -1;

			const res = await axios.get(
				`${apiParser(api.apiPath.post.getAuthor)}${user._id}?offset=${
					currentPage * 10
				}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.accessToken}`,
					},
					params,
				}
			);

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
		}, [user, currentPage]);

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


    const [animationKey, setAnimationKey] = useState(0); // Key để reset animation

    const handleTabClick = (tabName: any) => {
            setActive(tabName);
            setAnimationKey((prev) => prev + 1); // Tăng key để React render lại animation
    };

	return (
		<div className="container mx-auto px-12 lg:w-10/12">
			<div className="flex justify-between items-start">
				{/* Main blog section */}
				<div className="w-2/3 space-y-1">
					<div className="flex flex-col justify-center pt-3 px-5 space-y-8">
						<img
							src={user.coverPicture || guestUser.coverPicture}
						/>
						<div className="flex flex-row items-center justify-between">
							<h2 className="text-4xl font-bold">{user.name}</h2>
							<div className="flex flex-row items-center space-x-4">
								<button className="text-gray-500 focus:outline-none">
									<i className="fa-solid fa-ellipsis text-xl me-8"></i>
								</button>
							</div>
						</div>
					</div>

					<div className="flex flex-row space-x-10 items-center pt-2 text-nowrap scrollbar-custom px-5 mt-4">
						{[
							{ id: "home", label: "Trang chủ" },
							// { id: "bookmark", label: "Danh sách" },
							{ id: "author", label: "Về tác giả" },
						].map((tab) => (
							<button
								key={tab.id}
								className={
									active === tab.id
										? "pb-3 border-black border-b-2 text-black"
										: "pb-3 text-gray-500 hover:text-black"
								}
								onClick={() => handleTabClick(tab.id)}
							>
								{tab.label}
							</button>
						))}
					</div>
					<div key={animationKey} className="animate-fade-in-up">
						{active === "home" && <PostList posts={posts} action={action} currentPage={currentPage} total={total} />}
						{active === "bookmark" && null}
						{active === "author" && (
							<div className="flex flex-col space-y-3 ps-6 pe-11">
								{" "}
								<MarkdownRenderer
									content={
										DOMPurify.sanitize(user.description ||
										"Người dùng hiện không viết mô tả nào về bản thân họ")
									}
								></MarkdownRenderer>
							</div>
						)}
					</div>
				</div>

				{/* Profile sidebar */}

				<div className="w-1/3 p-4 pl-12">
					<div className="mt-6">
						<div className="flex flex-col space-y-2">
							<img
								src={
									user.profilePicture ||
									guestUser.profilePicture
								}
								alt="avatar"
								className="rounded-full w-24 h-24"
							/>
							<h2 className="font-semibold text-lg">
								{user.name}
							</h2>
							<p className="text-gray-500">1.2K Followers</p>
							<p className="text-sm text-gray-500">
								{user.bio ||
									"Người dùng hiện không viết mô tả nào về bản thân họ"}
							</p>
							<div className="flex flex-row space-x-2">
								<button className="bg-blue-400 rounded-full px-4 py-2 text-white text-sm font-bold">
									Follow
								</button>
								<a
									href={`mailto:${user.email}`}
									className="flex"
								>
									<div className="bg-blue-400 rounded-full w-9 text-white text-sm font-bold flex justify-center items-center">
										<FaRegEnvelope className="text-lg text-white stroke-black stroke-1" />
									</div>
								</a>
							</div>
						</div>
					</div>

					{user && (
						<div className="mt-12">
							<h3 className="font-semibold mb-5">
								Đã lưu gần đây
							</h3>
							<div className="space-y-5">
								{user.bookMarks ? (
									user.bookMarks.map(
										(bookmark: any, idx: any) => (
											<div key={idx} className="py-2">
												<a
													href={`/author/${bookmark.post.author.userId}`}
													className="flex flex-row items-center space-x-2 mb-3 text-sm"
												>
													<img
														src={
															bookmark.post.author
																.profilePicture
														}
														alt="User profile image"
														className="rounded-full w-6 h-6"
													/>
													<span className="font-semibold hover:text-gray-500">
														{
															bookmark.post.author
																.name
														}
													</span>
												</a>
												<a
													href={`/posts/${bookmark.post.postId}`}
												>
													<h2 className="font-semibold">
														{bookmark.post.title}
													</h2>
												</a>
												<div className="flex items-center space-x-2 text-xs mt-2">
													<p>
														{new Date(
															bookmark.post.date
														).toLocaleDateString()}
													</p>
													<p>·</p>
													<p>
														{
															bookmark.post.topic
																.name
														}
													</p>
												</div>
											</div>
										)
									)
								) : // Login to see bookmarks
								isLogin ? (
									<p className="text-gray-500 mb-4">
										Bạn chưa lưu nội dung nào
									</p>
								) : (
									<p className="text-gray-500 mb-4">
										Vui lòng đăng nhập để xem danh sách đã
										lưu
									</p>
								)}
							</div>
							{user.bookMarks && (
								<a
									href="/bookmarks"
									className="text-blue-500 text-sm hover:text-blue-400"
								>
									Xem danh sách đầy đủ
								</a>
							)}
						</div>
					)}

					<Footer />
				</div>
			</div>
		</div>
	);
}
