import Footer from "@/components/Footer";
import { SidebarProps } from "@/interfaces/Sidebar";

const Sidebar = ({ currentUser }: SidebarProps) => {
	return (
		<div className="w-1/3 pl-4 space-y-12">
			{/* Bookmarks */}
			{currentUser && (
				<div className="py-12">
					<h3 className="font-semibold mb-5">Đã lưu gần đây</h3>
					<div className="space-y-5">
						{currentUser.bookMarks.map((bookmark, idx) => (
							<div key={idx} className="py-2">
								<a
									href={`/author/${bookmark.post.author.userId}`}
									className="flex flex-row items-center space-x-2 mb-3 text-sm"
								>
									<img
										src={
											bookmark.post.author.profilePicture
										}
										alt="User profile image"
										className="rounded-full w-6 h-6"
									/>
									<span className="font-semibold hover:text-gray-500">
										{bookmark.post.author.name}
									</span>
								</a>
								<a href={`/posts/${bookmark.post.postId}`}>
									<h2 className="font-semibold">
										{bookmark.post.title}
									</h2>
								</a>
								<div className="flex items-center space-x-2 text-xs mt-2">
									<p>
										{new Date(
											bookmark.post.createdAt
										).toLocaleDateString()}
									</p>
									<p>·</p>
									<p>{bookmark.post.topic.name}</p>
								</div>
							</div>
						))}
					</div>
					<a
						href="/bookmarks"
						className="text-blue-500 text-sm hover:text-blue-400"
					>
						Xem danh sách đầy đủ
					</a>
				</div>
			)}

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
				<ul className="space-y-2 text-sm">
					<li>Tăng độ nổi tiếng</li>
					<li>Chia sẻ kiến thức</li>
					<li>Mở rộng networking</li>
				</ul>
				<button className="bg-black text-white px-4 py-2 rounded-full mt-6 text-sm">
					Viết bài ngay
				</button>
			</div>

			{/* Copyright */}
			<Footer />
		</div>
	);
};

export default Sidebar;
