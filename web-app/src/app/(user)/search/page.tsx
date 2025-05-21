"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostList from "@/components/user/PostList";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Tìm kiếm bài viết theo tên chủ đề
    const searchByTopicName = async (topicName: string) => {
        const topicRes = await fetch("http://localhost:3000/api/topic/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: topicName }),
        });
        const topicData = await topicRes.json();
        if (!topicData.data || topicData.data.length === 0) return [];
        const tagIds = topicData.data.map((topic: any) => topic.tagId);
        const postRes = await fetch("http://localhost:3000/api/post/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tagId: tagIds.length === 1 ? tagIds[0] : tagIds }),
        });
        const postData = await postRes.json();
        return postData.data || [];
    };

    useEffect(() => {
        if (!q) return;
        setLoading(true);
        Promise.all([
			fetch("http://localhost:3000/api/post/search", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: q, content: q, description: q }),
			}).then((res) => res.json()),
			searchByTopicName(q),
		])
			.then(([postResult, postsByTopic]) => {
				const posts1 = postResult.data || [];
				const posts2 = postsByTopic || [];
				// Loại bỏ trùng lặp theo postId
				const allPosts = [...posts1, ...posts2].filter(
					(post, index, self) =>
						index ===
						self.findIndex((p) => p.postId === post.postId)
				);
				setPosts(allPosts);
			})
			.finally(() => setLoading(false));
    }, [q]);

    return (
        <div>

            {/* Main content */}
            <div className="container mx-auto px-12 lg:w-10/12">
                <div className="flex justify-between items-start pt-12">
                    {/* Left: Posts */}
                    <div className="w-2/3">
                        <div className="flex flex-col justify-center px-5 space-y-8">
                            <div className="flex flex-row items-center justify-start">
                                <h2 className="text-4xl text-gray-500">
                                    Tìm kiếm cho <span className="text-black">{q}</span>
                                </h2>
                            </div>
                        </div>
                        <div className="flex flex-row space-x-10 items-center text-nowrap scrollbar-custom px-5 mt-7 mb-6">
                            <a className="pb-3 border-black border-b-2" href="#">Bài viết</a>
                            <a className="pb-3 text-gray-500 hover:text-black" href="#">Tác giả</a>
                            <a className="pb-3 text-gray-500 hover:text-black" href="#">Chủ đề</a>
                        </div>
                        {/* Post list */}
                        <PostList posts={posts} />
                    </div>
                    {/* Right: Sidebar */}
                    <div className="w-1/3 pl-12 space-y-12">
                        <div>
                            <h3 className="font-semibold mb-5">Có thể bạn quan tâm</h3>
                            <div className="space-y-5">
                                {/* Bạn có thể render các bài viết gợi ý ở đây */}
                                <div className="py-2">
                                    <a href="#" className="flex flex-row items-center space-x-2 mb-3 text-sm">
                                        <img src="https://placehold.co/32x32" alt="Profile" className="rounded-full w-6 h-6" />
                                        <span className="font-semibold hover:text-gray-500">Bao Duong</span>
                                    </a>
                                    <a href="#">
                                        <h2 className="font-semibold">Hướng sự kiện Java cơ bản cùng Netbeans</h2>
                                    </a>
                                    <div className="flex items-center space-x-2 text-xs mt-2">
                                        <p><a href="#">Apr 17, 2023</a></p>
                                        <p>·</p>
                                        <p><a href="#">Chủ đề Java</a></p>
                                    </div>
                                </div>
                            </div>
                            <a href="#" className="text-blue-500 text-sm hover:text-blue-400">See the full list</a>
                        </div>
                        <div className="text-left text-gray-500 text-sm">
                            <p>© {new Date().getFullYear()} iDev4rum. All rights reserved.</p>
                            <p>Designed by <a href="https://dtbao.io.vn/?s=javawww-baitaplon" className="text-blue-500">Duong Thai Bao</a></p>
                            <p className="text-red-500 mt-6"><strong>Notice: </strong>This project is intended for educational use and may overlap with existing copyrighted designs. If any of our work infringes on your copyright, please let us know so we can remove it.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}