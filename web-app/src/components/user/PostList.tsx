import { Post } from "@/interfaces/Post";
import PostItem from "./PostItem";
import { EUserRole, useUser } from "@/context/UserContext";

const PostList = ({ 
	posts, total = posts?.length || 0, 
	action = { prev: () => {}, next: () => {} },
	currentPage = 0
	}
	: { posts: Post[], total?: any, action?: any, currentPage?: any }) => {

	const { user, isUserReady } = useUser();

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
		<div>
			<div className="flex flex-col space-y-3">
				{posts.map((post, idx) => (
					post.status != "PUBLISHED"
					&& user.role != EUserRole.ADMIN && 
					post.userId != user._id ? null :
					(<PostItem key={idx} post={post} />)
				))}
			</div>
			<div className="flex justify-center mt-4">
				{total > 10 && (
					<div className="flex items-center space-x-2">
						<button
							onClick={action?.prev}
							className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
						>
							Trước
						</button>

						<span> | </span>

						<span className="text-gray-500">
							{`${currentPage + 1} / ${Math.ceil(total / 10)}`}
						</span>
						<span> | </span>
						<button
							onClick={action?.next}
							className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
						>
							Sau
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default PostList;
