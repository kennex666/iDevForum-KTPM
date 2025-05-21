import Footer from "@/components/Footer";
import { EUserRole, guestUser } from "@/context/UserContext";
import { SidebarProps } from "@/interfaces/Sidebar";
import { useUser } from '../../../context/UserContext';
import { useEffect, useState } from "react";
import { api, apiParser } from "@/constants/apiConst";

const Sidebar = ({ currentUser }: any) => {

	const { isLogin, user } = useUser();

	const [bookmarks, setBookmarks] = useState<any>([]);
	
	useEffect(() => {
		if (isLogin) {
			fetch(`${apiParser(api.apiPath.post.getBookmark)}${user?._id}`)
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
	}, [isLogin]);

	return (
		<div className="w-1/3 pl-4 space-y-12">
			{/* Bookmarks */}
				<div className="mt-12 bg-white p-4 rounded-lg shadow">
					<h3 className="font-semibold mb-5">Đã lưu gần đây</h3>
					<div className="space-y-5">
						{bookmarks.length === 0 && (
							<p className="text-gray-500 mb-4">
								Bạn chưa lưu nội dung nào
								</p>
								)}
						{bookmarks ? (
							bookmarks.map(
								(bookmark: any, idx: any) => { 
									if (!bookmark.author) {
										bookmark.author = guestUser;
									}
									if (!bookmark.topic) {
										bookmark.topic = {
											tagId: bookmark.tagId || "-1",
											name: bookmark.tagId == -1 ? "Chưa phân loại" : bookmark.tagId,
										};
									}
									return (
										<div key={idx} className="py-2">
											<a
												href={`/author/${bookmark.author.userId}`}
												className="flex flex-row items-center space-x-2 mb-3 text-sm"
											>
												<img
													src={
														bookmark.author
															.profilePicture
													}
													alt="User profile image"
													className="rounded-full w-6 h-6"
												/>
												<span className="font-semibold hover:text-gray-500">
													{bookmark.author.name}
												</span>
											</a>
											<a
												href={`/posts/${bookmark.postId}`}
											>
												<h2 className="text-sm">
													{bookmark.title}
												</h2>
											</a>
											<div className="flex items-center space-x-2 text-xs mt-2">
												<p>
													{new Date(
														bookmark.createdAt
													).toLocaleDateString()}
												</p>
												<p>·</p>
												<p>{bookmark.topic.name}</p>
											</div>
										</div>
									);
							}
								
							)
						) : // Login to see bookmarks
						isLogin ? (
							<p className="text-gray-500 mb-4">
								Bạn chưa lưu nội dung nào
							</p>
						) : (
							<p className="text-gray-500 mb-4">
								Vui lòng{" "}
								<a
									className="hover:underline text-blue-500"
									href="/login"
								>
									đăng nhập
								</a>{" "}
								để xem danh sách đã lưu
							</p>
						)}
					</div>
					{bookmarks && (
						<a
							href="/bookmarks"
							className="text-blue-500 text-sm hover:text-blue-400"
						>
							Xem danh sách đầy đủ
						</a>
					)}
				</div>

			{/* Chủ đề */}
			<div className="bg-white p-4 rounded-lg shadow">
				<h3 className="font-semibold mb-5">Chủ đề cho bạn</h3>
				<div className="flex flex-wrap gap-2">
					<a
						href="#"
						className="items-center px-4 py-1 rounded-full bg-gray-100"
					>
						Java
					</a>
					<a
						href="#"
						className="items-center px-4 py-1 rounded-full bg-gray-100"
					>
						GitHub
					</a>
					<a
						href="#"
						className="items-center px-4 py-1 rounded-full bg-gray-100"
					>
						Nsfw
					</a>
				</div>
			</div>

			{/* Ads */}
			<div className="bg-yellow-100 px-6 py-4 rounded-lg shadow">
				<h3 className="font-semibold mb-4 text-lg">
					Trở thành tác giả tại iDev4rum
				</h3>
				<ul className="space-y-2 text-sm mb-4">
					<li>Tăng độ nổi tiếng</li>
					<li>Chia sẻ kiến thức</li>
					<li>Mở rộng networking</li>
				</ul>
				<a
					href="/write"
					className="bg-black text-white px-4 py-2 rounded-full mt-6 text-sm"
				>
					Viết bài ngay
				</a>
			</div>

			{/* Copyright */}
			<Footer />
		</div>
	);
};

export default Sidebar;
