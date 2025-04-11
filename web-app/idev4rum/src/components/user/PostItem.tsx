import { Post } from "@/interfaces/Post";
import { FaStar, FaThumbsUp, FaComment } from "react-icons/fa";

const PostItem = ({ post }: { post: Post }) => {
	return (
		<div className="px-6 py-8 flex space-x-4 flex-row items-center border-b border-gray-200">
			<div className="w-4/6">
				{/* Tác giả + chủ đề */}
				<div className="flex items-center space-x-2 mb-3">
					<img
						src={post.author.profilePicture}
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
					href={`/posts/${post.url}`}
					className="text-2xl font-bold hover:underline"
				>
					{post.title}
				</a>
				<p>{post.description}</p>

				{/* Metadata */}
				<div className="flex justify-between mt-4 text-gray-600 text-sm">
					<div className="flex items-center gap-2">
						<FaStar />
						<span>{post.date}</span>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex flex-row gap-1">
							<FaThumbsUp />
							<span>{post.totalUpVote}</span>
						</div>
						<div className="flex flex-row gap-1">
							<FaComment />
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
					src="https://placehold.co/150x150"
					className="rounded-lg h-32 w-32 object-cover"
					alt="Post preview"
				/>
			</a>
		</div>
	);
};

export default PostItem;
