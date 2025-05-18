"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import DOMPurify from "dompurify";
import MarkdownRenderer from "@/components/user/MarkdownRenderer";
import Navbar from "@/components/user/Navbar";
import {
	FaThumbsUp,
	FaThumbsDown,
	FaComment,
	FaExclamation,
	FaBookmark,
	FaShare,
	FaPen,
} from "react-icons/fa";
import { api, apiParser } from "@/constants/apiConst";
import Error from "@/components/Error";
import Loading from "@/components/user/Loading";
import { guestUser } from "@/context/UserContext";
import { formatDate, getDateOnly, getReadingTime } from '../../../utils/datetimeformat';

interface User {
	userId: number;
	name: string;
	profilePicture: string;
}

interface Comment {
	user: User;
	content: string;
	createdAt: string;
}

interface Post {
	postId: number;
	title: string;
	description: string;
	content: string;
	date: string;
	topic: { name: string };
	author: User;
	comments: Comment[];
	totalUpvote: number;
	totalDownvote: number;
	totalComments: number;
	isOwner?: boolean;
}

export default function PostDetailPage() {
	const { id } = useParams();
	const [data, setData] = useState<any | null>(null);
	const [isFollowing, setIsFollowing] = useState(false);
	const [reaction, setReaction] = useState<string>("");
	const [comments, setComments] = useState<Comment[]>([]);
	const [comment, setComment] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch(apiParser(api.apiPath.post.getInfo.replace(":id", id)))
			.then((res) => res.json())
			.then((data) => {
				if (data.errorCode != 200) {
					return;
				}
				const p = data.data;
				if (!p.author) {
					p.author = guestUser;
					p.author.name = "<<Name>>";
				}
				if (!p.topic) {
					p.topic = {
						tagId: "unknown",
						name: "<<Topic>>",
					};
				}
				p.post.contentDOM = DOMPurify.sanitize(p.post.content);
				setData(p);
				setReaction("");
				setComments(p.comments || []);
			}).finally(() => setIsLoading(false));
	}, [id]);

	const handleFollow = () => {
		if (!data) return;
		fetch(`/api/users/following?id=${data.author.userId}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.errorCode === 200) setIsFollowing(!isFollowing);
			});
	};

	const handleVote = (type: boolean) => {
		if (!data) return;

		
		fetch(`/api/vote/${data.postId}?type=${type ? 1 : 0}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.errorCode === 200) {
					if (reaction == "upvote" && type) {
						setReaction("");
						setData((prev: any) => ({
							...prev,
							totalUpvote: prev.totalUpvote - 1,
						}));
					}
					if (reaction == "downvote" && !type) {
						setReaction("");
						setData((prev: Post) => ({
							...prev,
							totalDownvote: prev.totalDownvote - 1,
						}));
					}

					if (reaction == "") {
						setData((prev: Post) => ({
							...prev,
							totalUpvote: prev.totalUpvote + (type ? 1 : 0),
							totalDownvote: prev.totalDownvote + (type ? 0 : 1),
						}));
						setReaction(type ? "upvote" : "downvote");
					}
				}
			});
	};

	const handleComment = () => {
		if (!comment.trim() || !data) return;
		fetch(`/api/comments/create`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content: comment, idPost: data.post.postId }),
		})
			.then((res) => res.json())
			.then((data) => {
				setComments((prev) => [data.data, ...prev]);
				setComment("");
			});
	};

	if (!data) return !isLoading ? <Error /> : <Loading />;

	return (
		<div className="container mx-auto px-6 lg:w-6/12 w-full mt-12 pb-12">
			<h1 className="text-3xl font-semibold mb-2">{data.post.title}</h1>
			<p className="text text-gray-700 mb-4">{data.post.description}</p>

			<div className="flex items-center gap-3 mb-6">
				<img
					src={data.author.profilePicture}
					alt="avatar"
					className="w-10 h-10 rounded-full"
				/>
				<div>
					<div className="flex items-center gap-2">
						<p className="text-sm font-semibold">
							{data.author.name}
						</p>
						<span className="text-gray-500">·</span>
						<button
							onClick={handleFollow}
							className="text-blue-500 text-sm"
						>
							{isFollowing ? "Huỷ theo dõi" : "Theo dõi"}
						</button>
					</div>
					<p className="text-sm text-gray-500">
						{getReadingTime(data.post.content) +
							" phút đọc · " +
							getDateOnly(data.post.createdAt) +
							" · " +
							data.topic.name}
					</p>
				</div>
			</div>

			<div className="flex flex-row justify-between mt-4 border-y py-4 px-2">
				<div className="flex flex-row gap-4">
					<button
						onClick={() => handleVote(true)}
						className="flex flex-row gap-2 items-center text-gray-500 focus:outline-none"
					>
						<FaThumbsUp
							className={
								reaction === "upvote" ? "text-blue-500" : ""
							}
						/>
						<span>{data.post.totalUpvote}</span>
					</button>
					<button
						onClick={() => handleVote(false)}
						className="flex flex-row gap-2 items-center text-gray-500 focus:outline-none"
					>
						<FaThumbsDown
							className={
								reaction === "downvote" ? "text-blue-500" : ""
							}
						/>
						<span>{data.post.totalDownvote}</span>
					</button>
					<a
						href="#comment-view"
						className="flex flex-row gap-2 items-center text-gray-500 focus:outline-none"
					>
						<FaComment />
						<span>{data.post.totalComments}</span>
					</a>
				</div>
				<div className="flex flex-row gap-6">
					<button className="text-gray-500 focus:outline-none">
						<FaExclamation />
					</button>
					<button className="text-gray-500 focus:outline-none">
						<FaBookmark />
					</button>
					<button
						onClick={() =>
							window.open(
								`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
									window.location.href
								)}`,
								"_blank",
								"width=600,height=400,scrollbars=yes,resizable=yes"
							)
						}
						className="text-gray-500 focus:outline-none"
					>
						<FaShare />
					</button>
					{data.post.isOwner && (
						<button
							onClick={() =>
								(location.href = `/write?id=${data.post.postId}`)
							}
							className="text-gray-500 focus:outline-none"
						>
							<FaPen />
						</button>
					)}
				</div>
			</div>

			<MarkdownRenderer content={data.post.contentDOM} />

			<div className="mt-8" id="comment-view">
				<h3 className="text-2xl font-semibold mb-6">
					Bình luận của độc giả
				</h3>

				<div className="flex flex-col gap-3 mb-4">
					<textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						className="w-full p-4 border border-gray-200 rounded-md focus:outline-none"
						placeholder="Viết bình luận..."
					></textarea>
					<div className="flex justify-end">
						<button
							disabled={!comment.trim()}
							onClick={handleComment}
							className={`px-6 py-1 rounded-full text-white focus:outline-none ${
								comment.trim()
									? "bg-blue-500 hover:bg-blue-400"
									: "bg-gray-500"
							}`}
						>
							Gửi
						</button>
					</div>
				</div>

				<div className="border-t mt-6 pt-4 space-y-6">
					{comments.length === 0 && (
						<p className="text-gray-500 text-sm">
							Chưa có bình luận nào
						</p>
					)}

					{comments.map((c, idx) => (
						<div key={idx} className="flex gap-4 items-start">
							<img
								src={c.user.profilePicture}
								alt="user"
								className="w-10 h-10 rounded-full"
							/>
							<div>
								<div className="flex gap-2 items-center">
									<p className="text-sm font-semibold">
										{c.user.name}
									</p>
									<span className="text-gray-500">·</span>
									<span className="text-sm text-gray-500">
										{c.createdAt}
									</span>
								</div>
								<p className="text-sm">{c.content}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
