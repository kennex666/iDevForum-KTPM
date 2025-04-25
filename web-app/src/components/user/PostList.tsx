import { Post } from "@/interfaces/Post";
import PostItem from "./PostItem";

const PostList = ({ posts }: { posts: Post[] }) => {
	if (!posts || posts.length === 0) {
		return (
			<div className="flex flex-col items-center space-y-4">
				<h2 className="text-2xl font-semibold">
					Không có bài viết nào
				</h2>
				<p className="text-gray-500 text-center">
					Hãy theo dõi một số tác giả để xem bài viết của họ
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col space-y-3">
			{posts.map((post, idx) => (
				<PostItem key={idx} post={post} />
			))}
		</div>
	);
};

export default PostList;
