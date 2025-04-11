import { Post } from "@/interfaces/Post";

const PostItem = ({ post }: { post: Post }) => {
	return (
		<div className="px-6 py-8 flex space-x-4 flex-row items-center border-b border-gray-200">
			<div className="w-4/6">
				<div className="flex items-center space-x-2 mb-3">
					<img
						src={post.author.profilePicture}
						className="w-6 h-6 rounded-full"
					/>
					<p className="text-sm text-gray-500">
						<span className="font-semibold">
							{post.author.name}
						</span>{" "}
						với chủ đề{" "}
						<span className="font-semibold">{post.topic.name}</span>
					</p>
				</div>
				<a href={`/posts/${post.url}`} className="text-2xl font-bold">
					{post.title}
				</a>
				<p>{post.description}</p>
				<div className="flex justify-between mt-4 text-gray-600">
					<div className="flex items-center gap-2">
						<i className="far fa-star" />
						<span>{post.date}</span>
					</div>
					<div className="flex items-center gap-2">
						<span>{post.totalUpVote}</span>
						<i className="far fa-thumbs-up" />
						<span>{post.totalComments}</span>
						<i className="far fa-comment" />
					</div>
				</div>
			</div>
			<a
				href={`/posts/${post.url}`}
				className="w-2/6 flex justify-center items-center"
			>
				<img
					src="https://placehold.co/150x150"
					className="rounded-lg"
				/>
			</a>
		</div>
	);
};

export default PostItem;
