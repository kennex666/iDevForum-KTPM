"use client";

import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/user/MarkdownRenderer";
import PostList from "@/components/user/PostList";
import { guestUser, useUser } from "@/context/UserContext";
import { Post } from "@/interfaces/Post";
import { useEffect, useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import DOMPurify from "dompurify";
import { api, apiParser } from "@/constants/apiConst";
import axios from "axios";
import { useParams } from "next/navigation";
import { getAccessToken } from "@/app/utils/cookiesParse";
import Toast from "@/components/Toast";
import UpdateUserModal from "@/components/user/UpdateUserModel";

export default function AuthorHome() {
	const { id } = useParams();
	const [active, setActive] = useState("home");

	const [ user, setUser ] = useState<any>({});
	const { isLogin, user: me, isUserReady: isMeReady } = useUser();
	const [isFollowing, setIsFollowing] = useState(false);

	const [posts, setPosts] = useState<Post[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [isUserReady, setIsUserReady] = useState(false);

	const [totalFollowers, setTotalFollowers] = useState(0);

	// Toát
	const [toastType, setToastType] = useState("error");
	const [showToast, setShowToast] = useState("");
	
	const [currentBookmarks, setCurrentBookmarks] = useState(0);
	const [totalBookmark, setTotalBookmark] = useState(0);
	const [showModalUpdate, setShowModalUpdate] = useState(false);


	const fetchPosts = async () => {
		const params: Record<string, any> = {};

		params.sort = -1;

		const res = await axios.get(
			`${apiParser(api.apiPath.post.getAuthor)}${id}?offset=${
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

	const [bookmarks, setBookmarks] = useState<any>([]);

	useEffect(() => {
		if (isUserReady) {
			fetch(`${apiParser(api.apiPath.post.getBookmark)}${id}?offset=${currentBookmarks * 10}`)
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					if (data?.data) {
						setBookmarks(data.data);
					} else {
						console.error("Error fetching bookmarks:", data);
						setBookmarks([]);
					}
				})
				.catch((error) => {
					console.error("Error fetching bookmarks:", error);
					setBookmarks([]);
				});
		}
	}, [isUserReady]);

	const actionBookmark = {
		prev: () => {
			if (currentBookmarks > 0) {
				setCurrentBookmarks(currentBookmarks - 1);
			}
		},
		next: () => {
			if (currentBookmarks < Math.floor(totalBookmark / 10)) {
				setCurrentBookmarks(currentBookmarks + 1);
			}
		},
	};


	const getFollowerProfile = async () => {
		const queryParams = new URLSearchParams({
			id: id,
			userId: me?._id || "",
		} as any).toString();
		// query params id, userId
		fetch(
			`${apiParser(api.apiPath.user.getFollowerProfile)}?${queryParams}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.errorCode === 200) {
					setTotalFollowers(data.data.totalFollower);
					setIsFollowing(data.data.isFollowing);
				} else {
					setShowToast(
						data.errorMessage ||
							"Có lỗi xảy ra, vui lòng thử lại sau"
					);
					setToastType("error");
					setTimeout(() => {
						setShowToast("");
					}, 4000);
				}
			});
	}


	const handleFollow = () => {
		if (!user) {
			setShowToast("Không tìm thấy ID người dùng, hãy thử refresh lại trang");
			setToastType("error");
			setTimeout(() => {
				setShowToast("");
			}, 4000);
			return;
		}
		if (!isLogin) {
			setShowToast("Vui lòng đăng nhập để thực hiện hành động này");
			setToastType("error");
			setTimeout(() => {
				setShowToast("");
			}, 4000);
			return;
		}
		fetch(
			`${apiParser(
				api.apiPath.userAction.follow.replace(
					":id",
					id
				)
			)}`,
			{
				// header jwt in cookies
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getAccessToken()}`,
				},
			}
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.errorCode === 200) {
					if (data.action == "follow") {
						setTotalFollowers((prev) => prev + 1);
					} else {
						setTotalFollowers((prev) => prev - 1);
					}
					setIsFollowing(data.action == "follow");
				} else {
					setShowToast(
						data.errorMessage ||
							"Có lỗi xảy ra, vui lòng thử lại sau"
					);
					setToastType("error");
					setTimeout(() => {
						setShowToast("");
					}, 4000);
				}
			});
	};

	const fetchUserProfile = async () => {
		const res = await axios.get(
			`${apiParser(api.apiPath.user.get.replace(":id", id))}`
		);

		const data = await res.data;
		if (data?.data) {
			console.log(data);
			setUser(data?.data);
			setIsUserReady(true);
		} else {
			console.error("Error fetching posts:", data);
		}
	}

	useEffect(() => {
		if (isUserReady){
			fetchPosts();
		}
	}, [isUserReady, currentPage]);

	useEffect(() => {
		if (isUserReady) {
			getFollowerProfile();
		}
	}, [isMeReady]);

	useEffect(() => {
		if (id)
			fetchUserProfile();
	}, [id])

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
			{showModalUpdate && (
				<UpdateUserModal
					currentUser={user}
					onClose={() => setShowModalUpdate(false)}
					onUpdated={() => fetchUserProfile()}
					setToast={(data: any) => {
						setToastType(data.type);
						setShowToast(data.message);
						setTimeout(()=>{
							setShowToast("");
						}, 4000)
					}}
				/>
			)}
			{showToast && (
				<Toast
					message={showToast}
					type={(toastType as any) || "error"}
				/>
			)}
			<div className="flex justify-between items-start">
				{/* Main blog section */}
				<div className="w-2/3 space-y-1">
					<div className="flex flex-col justify-center pt-3 px-5 space-y-8">
						<img
							src={user?.coverPicture || guestUser.coverPicture}
						/>
						<div className="flex flex-row items-center justify-between">
							<h2 className="text-4xl font-bold">{user?.name}</h2>
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
							{ id: "bookmark", label: "Danh sách đã lưu" },
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
						{active === "home" && (
							<PostList
								posts={posts}
								action={action}
								currentPage={currentPage}
								total={total}
							/>
						)}
						{active === "bookmark" && (
							<PostList
								posts={bookmarks}
								action={actionBookmark}
								currentPage={currentBookmarks}
								total={totalBookmark}
							/>
						)}
						{active === "author" && (
							<div className="flex flex-col space-y-3 ps-6 pe-11">
								{" "}
								<MarkdownRenderer
									content={DOMPurify.sanitize(
										user?.description ||
											"Người dùng hiện không viết mô tả nào về bản thân họ"
									)}
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
									user?.profilePicture ||
									guestUser.profilePicture
								}
								alt="avatar"
								className="rounded-full w-24 h-24"
							/>
							<h2 className="font-semibold text-lg">
								{user?.name}
							</h2>
							<p className="text-gray-500">{`${
								totalFollowers.toLocaleString(
									// I want this like 1,000
									// 10,000
									"en-US",
									{
										minimumFractionDigits: 0,
										maximumFractionDigits: 0,
									}
								) || 0
							} Followers`}</p>
							<p className="text-sm text-gray-500">
								{user?.bio ||
									"Người dùng hiện không viết mô tả nào về bản thân họ"}
							</p>
							<div className="flex flex-row space-x-2">
								<button
									onClick={handleFollow}
									className={
										isFollowing
											? "bg-red-400 rounded-full px-4 py-2 text-white text-sm font-bold hover:bg-red-200"
											: "bg-blue-400 rounded-full px-4 py-2 text-white text-sm font-bold hover:bg-blue-300 hover:cursor-pointer"
									}
								>
									{isFollowing ? "Đang theo dõi" : "Theo dõi"}
								</button>
								{isLogin && me?._id === user?._id ? (
									<button
										onClick={() => setShowModalUpdate(true)}
										className="text-sm text-gray-600 hover:underline"
									>
										Chỉnh sửa hồ sơ
									</button>
								) : (
									<a
										href={`mailto:${
											user?.email || "idev4rum@pj.io.vn"
										}`}
									>
										<div className="bg-blue-400 rounded-full px-4 py-2 text-white text-sm font-bold hover:bg-blue-300 hover:cursor-pointer">
											<FaRegEnvelope className="text-lg text-white stroke-black stroke-1" />
										</div>
									</a>
								)}
							</div>
						</div>
					</div>

					<Footer />
				</div>
			</div>
		</div>
	);
}
