import Navbar from "@/components/user/Navbar";
import PostList from "@/components/user/PostList";
import Sidebar from "@/components/user/sidebar/Sidebar";
import TabBar from "@/components/user/TabBar";
import { Post } from "@/interfaces/Post";


// Giả bộ user:
const user = {
	bookMarks: [
		{
			post: {
				postId: "1",
				title: "Giới thiệu về Java",
				createdAt: "2023-04-17",
				topic: { tagId: "java", name: "Java" },
				author: {
					userId: "123",
					name: "Duong Thai Bao",
					profilePicture: "https://placehold.co/40x40",
				},
			},
		},
	],
};


export default function HomePage() {
	const activeTab = "home"; // lấy từ query nếu cần
	const posts = [] as Post[]; // fetch từ API hoặc mock

	return (
		<>
			<Navbar />
			<div className="container mx-auto px-12 lg:w-10/12">
				<div className="flex justify-between items-start py-4">
					<div className="w-2/3 space-y-8">
						<TabBar activeTab={activeTab} />
						<PostList posts={posts} />
						{/* Phân trang nếu cần */}
					</div>
					<Sidebar currentUser={user} />
				</div>
			</div>
		</>
	);
}
