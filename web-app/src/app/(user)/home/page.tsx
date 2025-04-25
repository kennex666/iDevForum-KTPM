import Navbar from "@/components/user/Navbar";
import PostList from "@/components/user/PostList";
import Sidebar from "@/components/user/sidebar/Sidebar";
import TabBar from "@/components/user/TabBar";
import { Post } from "@/interfaces/Post";



export default function HomePage() {
	const activeTab = "home"; // lấy từ query nếu cần
	const posts = [ 
		{
			title: "Giới thiệu về Java",
			description: "Java là một ngôn ngữ lập trình hướng đối tượng, được phát triển bởi Sun Microsystems.",
			topic: { tagId: "java", name: "Java" },
				date: "2023-04-17",
				totalUpVote: 100,
				totalComments: 50,
				url: "gioi-thieu-ve-java",
			
			author: {
				userId: "123",
				name: "Duong Thai Bao",
				profilePicture: "https://placehold.co/40x40",
			},
		},
	] as Post[]; // fetch từ API hoặc mock

	// Giả bộ user:
	const user = {
		bookMarks: [
			{
				post: {
					title: "Giới thiệu về Java",
					description:
						"Java là một ngôn ngữ lập trình hướng đối tượng, được phát triển bởi Sun Microsystems.",
					topic: { tagId: "java", name: "Java" },
					date: "2023-04-17",
					totalUpVote: 100,
					totalComments: 50,
					url: "gioi-thieu-ve-java",

					author: {
						userId: "123",
						name: "Duong Thai Bao",
						profilePicture: "https://placehold.co/40x40",
					},
				},
			},
		],
	};

	return (
		<>
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
