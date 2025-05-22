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
	FaTimes,
} from "react-icons/fa";
import { api, apiParser } from "@/constants/apiConst";
import Error from "@/components/Error";
import Loading from "@/components/user/Loading";
import { EUserRole, guestUser, useUser } from "@/context/UserContext";
import { formatDate, getDateOnly, getReadingTime } from '../../../utils/datetimeformat';
import { getAccessToken } from "@/app/utils/cookiesParse";
import Toast from "@/components/Toast";

interface User {
	userId: number;
	name: string;
	profilePicture: string;
}

interface Comment {
	commentId: String;
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
	user: User;
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
	const [toastType, setToastType] = useState("error");
	const [showToast, setShowToast] = useState("");
	const { user, isUserReady, isLogin } = useUser();
	const [showReportModel, setShowReportModel] = useState(false);
	const [reason, setReason] = useState("");

	useEffect(() => {
		if (id && isUserReady)
			fetch(apiParser(api.apiPath.post.getInfo.replace(":id", id)))
				.then((res) => res.json())
				.then((data) => {
					if (data.errorCode != 200) {
						return;
					}
					const p = data.data;
					if (!p.user) {
						p.user = guestUser;
						p.user.name = "<<Name>>";
					}
					if (!p.topic) {
						p.topic = {
							tagId: p.tagId || "-1",
							name: p.tagId || "Chưa phân loại",
						};
					}
					console.log(user._id)
					p.post.isOwner = p.post.userId == user?._id;
					if (
						!p.post.isOwner &&
						p.post.status != "PUBLISHED" &&
						user.role != EUserRole.ADMIN
					) {
						setShowToast("Bài viết không tồn tại hoặc đã bị xóa");
						setTimeout(() => {
							setShowToast("");
							window.history.back();
						}, 4000);
						setData(null);
						setIsLoading(false);
						return;
					}
					p.post.contentDOM = DOMPurify.sanitize(p.post.content);
					setData(p);
					setReaction("");
					setComments(p.comments || []);
				})
				.finally(() => setIsLoading(false));
			fetch(`${apiParser(api.apiPath.comment)}/post/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getAccessToken()}`,
				},
			})
				.then((res) => res.json()
			)
				.then((data) => {
					console.log(data)
					if (data.errorCode == 200) {
						setComments(data.data);
					}
				});
	}, [id, isUserReady, user?._id]);

	const handleFollow = () => {
		if (!data) return;
		fetch(
			`${apiParser(
				api.apiPath.userAction.follow.replace(":id", data.post.userId)
			)}`,
			{
				// header jwt in cookies
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getAccessToken()}`,
				},
			}
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.errorCode === 200) {
					setIsFollowing(data.action == "follow");
				} else {
					setShowToast(
						data.errorMessage ||
							"Có lỗi xảy ra, vui lòng thử lại sau"
					);
					setToastType("error");
					setTimeout(() => {
						setShowToast("");
					}
					, 4000);
				}
			});
	};

	const handleBookmark = () => {
		if (!data) return;
		fetch(
			`${apiParser(api.apiPath.post.actionBookmark)}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getAccessToken()}`,
				},
				body: JSON.stringify({
					postId: data.post.postId
				}),
			}
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.errorCode == 200) {
					setToastType("success");
					setShowToast((pre) => {
						return data.action == "save"
							? "Đã lưu bài viết"
							: "Đã bỏ lưu bài viết";
					});
				} else {
					setShowToast(
						data.errorMessage ||
							"Có lỗi xảy ra, vui lòng thử lại sau"
					);
					setToastType("error");
				}
				setTimeout(() => {
					setShowToast("");
				}, 4000);
			}).catch((err) => {
				setShowToast("Có lỗi xảy ra");
				setToastType("error");
				setTimeout(() => {
					setShowToast("");
				}, 4000);
			});
	}

	const handleVote = (type: boolean) => {
		if (!data) return;

		
		fetch(
			`${apiParser(api.apiPath.reaction.action)}${
				type ? "upvote" : "downvote"
			}/${data.post.postId}`
		, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${getAccessToken()}`,
			}
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.errorCode == 200) {
					const reactionAfter = !data?.data
						? ""
						: data?.data.type.toString().toLowerCase();
					
					if (reactionAfter == reaction) {
						return;
					}
					
					if (reactionAfter == "upvote") {
						setData( pre => {
							return {
								...pre,
								post: {
									...pre.post,
									totalUpvote: pre.post.totalUpvote + 1,
									totalDownvote: pre.post.totalDownvote + reaction == "downvote" ? -1 : 0,
								},
							};
						})
						
						setReaction("upvote");
					} else if (reactionAfter == "downvote") {
						setData( pre => {
							return {
								...pre,
								post: {
									...pre.post,
									totalDownvote: pre.post.totalDownvote + 1,
									totalUpvote: pre.post.totalUpvote + reaction == "upvote" ? -1 : 0,
								},
							};
						})
						setReaction("downvote");
					} else {
						setData( pre => {
							return {
								...pre,
								post: {
									...pre.post,
									totalUpvote: pre.post.totalUpvote + reaction == "upvote" ? -1 : 0,
									totalDownvote: pre.post.totalDownvote + reaction == "downvote" ? -1 : 0,
								},
							};
						})
						setReaction("");
					}
				}
			});
	};

	const handleComment = () => {
		if (!comment.trim() || !data) return;
		const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];
		console.log(token);
        if (!token) return;
		fetch(`${apiParser(api.apiPath.comment)}/save`, {
			method: "POST",
			headers: { 
				"Content-Type": "application/json" ,
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ content: comment, postId: data.post.postId }),
		})
			.then((res) => res.json())
			.then((data) => {
				if(data.data != null) {
					console.log(data)
					setComments((prev) => [data.data, ...prev]);
					setComment("");
				} else {
					setShowToast("Bạn đang thao tác quá nhanh");
					setToastType("error");
					setTimeout(() => {
						setShowToast("");
					}, 4000);
				}
			}).catch((err) => {
				setShowToast(err);
				setToastType("error");
				setTimeout(() => {
					setShowToast("");
				}, 4000);
			})
	};

	const sendReport = (reason: string, postId: string) => {
		// info
		// reason and postId
		// /api/postreport/save
		fetch(`${apiParser(api.apiPath.postReport.create)}`, {
			method: "POST",
			headers: { 
				"Content-Type": "application/json",
				Authorization: `Bearer ${getAccessToken()}`,
			 },
			body: JSON.stringify({ reason, postId }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.errorCode == 200) {
					
					setToastType("success");
					setShowToast("Báo cáo thành công");
				} else {
					setShowToast(data.errorMessage || "Có lỗi xảy ra");
					setToastType("error");
				}
				setTimeout(() => {
					setShowToast("");
				}, 4000);
			}).catch((err) => {
				setShowToast("Có lỗi xảy ra");
				setToastType("error");
				setTimeout(() => {
					setShowToast("");
				}, 4000);
			});
	}

	const showModelForReport = () => {
		// show modal for report
		setShowReportModel(!showReportModel);
	}

	const removeComment = (c: any) => {
		console.log("remove", c)
		if (!id) return;

		const token = document.cookie
			.split("; ")
			.find((row) => row.startsWith("accessToken="))
			?.split("=")[1];
		console.log(token)
		if (!token) {
			console.error("Token không tồn tại");
			return;
		}

		fetch(`${apiParser(api.apiPath.comment)}/${c.id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.errorCode == 200) {
					setComments((prev) => prev.filter((item) => item.id !== c.id));
					setToastType("success");
					setShowToast("Xóa bình luận thành công");
				} else {
					setToastType("error");
					setShowToast("Xóa bình luận thất bại");
				}
				setTimeout(() => setShowToast(""), 3000);
			})
			.catch((err) => {
				setToastType("error");
				setShowToast("Có lỗi xảy ra");
				setTimeout(() => setShowToast(""), 3000);
			});
	};


	if (!data) return !isLoading ? <Error /> : <Loading />;

	return (
		<div className="container mx-auto px-6 lg:w-6/12 w-full mt-12 pb-12">
			{showReportModel && (
				<div className="fixed inset-0 flex items-center justify-center z-[25]">
					<div
						onClick={() => setShowReportModel(false)}
						className="fixed inset-0 bg-gray-700 opacity-50 flex items-center justify-center z-[23]"
					></div>
					<div className="bg-white rounded-lg p-6 w-96 z-[25]">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-semibold">
								Báo cáo bài viết
							</h2>
							{/* Nút đóng */}
							<button
								onClick={() => setShowReportModel(false)}
								className="text-gray-500 hover:text-gray-700 focus:outline-none"
							>
								<FaTimes />
							</button>
						</div>

						<textarea
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							className="w-full p-4 border border-gray-200 rounded-md focus:outline-none"
							placeholder="Nhập lý do báo cáo..."
						></textarea>
						<div className="flex justify-end mt-4">
							<button
								onClick={() => {
									sendReport(reason, data.post.postId);
									setShowReportModel(false);
								}}
								className={`px-6 py-1 rounded-full text-white focus:outline-none bg-blue-500 hover:bg-blue-400`}
							>
								Gửi
							</button>
						</div>
					</div>
				</div>
			)}
			{showToast && (
				<Toast
					message={showToast}
					type={(toastType as any) || "error"}
				/>
			)}
			<h1 className="text-3xl font-semibold mb-2">{data.post.title}</h1>
			<p className="text text-gray-700 mb-4">{data.post.description}</p>

			<div className="flex items-center gap-3 mb-6">
				<img
					src={data.user.profilePicture}
					alt="avatar"
					className="w-10 h-10 rounded-full"
				/>
				<div>
					<div className="flex items-center gap-2">
						<p className="text-sm font-semibold">
							<a
								href={`/author/${data.post.userId}`}
								className="hover:underline"
							>
								{data.user.name}
							</a>
						</p>
						<span className="text-gray-500">·</span>
						<button
							onClick={handleFollow}
							className="text-blue-500 text-sm hover:text-blue-600 hover:underline focus:outline-none"
						>
							{isFollowing ? "Đang theo dõi" : "Theo dõi"}
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
					{isLogin && (
						<button
							onClick={showModelForReport}
							className="text-gray-500 focus:outline-none"
						>
							<FaExclamation />
						</button>
					)}
					<button
						onClick={handleBookmark}
						className="text-gray-500 focus:outline-none"
					>
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
						<div
							key={idx}
							className="flex gap-3 items-start relative group py-3 px-2 hover:bg-gray-50 rounded-md"
						>
							<img
								src={
									c.user.profilePicture ||
									"https://placehold.co/400"
								}
								alt="user"
								className="w-10 h-10 rounded-full object-cover border"
							/>
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<p className="text-sm font-bold text-gray-900">
										{c.user.name}
									</p>
									<span className="text-gray-400">•</span>
									<span className="text-sm text-gray-500">
										{formatDate(c.createdAt)}
									</span>
								</div>
								<p className="text-sm text-gray-700">
									{c.content}
								</p>
							</div>

							{/* Nút tuỳ chọn */}
							{c.user._id == user._id && (
								<button
									className="p-1 rounded-full hover:bg-gray-200 transition focus:outline-none absolute top-2 right-2"
									onClick={() => {
										const menu = document.getElementById(
											`comment-menu-${idx}`
										);
										if (menu)
											menu.classList.toggle("hidden");
									}}
								>
									<span className="text-xl text-gray-600">
										⋮
									</span>
								</button>
							)}

							{/* Menu tuỳ chọn */}
							<div
								id={`comment-menu-${idx}`}
								className="hidden absolute right-2 top-10 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[140px] overflow-hidden"
							>
								<button
									className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
									onClick={() => removeComment(c)}
								>
									🗑️ Xoá
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
