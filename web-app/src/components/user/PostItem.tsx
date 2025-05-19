import { guestUser } from "@/context/UserContext";
import { Post } from "@/interfaces/Post";
import { FaStar, FaThumbsUp, FaComment, FaThumbsDown } from "react-icons/fa";
import { formatDate } from '../../app/utils/datetimeformat';

const PostItem = ({ post }: { post: Post }) => {
	if (!post.author){
		post.author = guestUser;
		post.author.name = "<<Name>>"
	}
	if (!post.topic) {
		post.topic = {
			tagId: "unknown",
			name: "<<Topic>>",
		};
	}
	return (
		<div className="px-6 py-8 flex space-x-4 flex-row items-center border-b border-gray-200">
			<div className="w-4/6">
				{/* Tác giả + chủ đề */}
				<div className="flex items-center space-x-2 mb-3">
					<img
						src={post.author.profilePicture || "https://placehold.co/40x40"}
						className="w-6 h-6 rounded-full"
						alt={`${post.author.name} avatar`}
					/>
					<p className="text-sm text-gray-500">
						<span className="font-semibold">
							{post.author.name}
						</span>{" "}
						với chủ đề{" "}
						<span className="font-semibold">{post.topic.name}</span>
					</p>
				</div>

				{/* Tiêu đề + mô tả */}
				<a
					href={`/posts/${post.postId}`}
					className="text-2xl font-bold hover:underline"
				>
					{post.title}
				</a>
				<p className="mt-2">{post.description}</p>

				{/* Metadata */}
				<div className="flex justify-between mt-4 text-gray-600 text-sm">
					<div className="flex gap-1">
						<FaStar className="w-4 h-4" />
						<span>{formatDate(post.createdAt)}</span>
					</div>
					<div className="flex gap-3">
						<div className="flex gap-1">
							<FaThumbsUp className="w-4 h-4" />
							<span>{post.totalUpvote}</span>
						</div>
						<div className="flex gap-1">
							<FaThumbsDown className="w-4 h-4" />
							<span>{post.totalDownvote}</span>
						</div>
						<div className="flex gap-1">
							<FaComment className="w-4 h-4" />
							<span>{post.totalComments}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Ảnh preview */}
			<a
				href={`/posts/${post.url}`}
				className="w-2/6 flex justify-center items-center"
			>
				<img
					src={post?.coverImage || "https://placehold.co/200x200"}
					className="rounded-lg h-32 w-32 object-cover"
					alt="Post preview"
				/>
			</a>
		</div>
	);
};

export default PostItem;
