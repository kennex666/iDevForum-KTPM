"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Tìm kiếm bài viết theo tên chủ đề
    const searchByTopicName = async (topicName: string) => {
        // 1. Gọi API tìm chủ đề theo name
        const topicRes = await fetch("http://localhost:3000/api/topic/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: topicName }),
        });
        const topicData = await topicRes.json();
        if (!topicData.data || topicData.data.length === 0) return [];

        // 2. Lấy danh sách tagId của các chủ đề tìm được
        const tagIds = topicData.data.map((topic: any) => topic.tagId);

        // 3. Gọi API tìm bài viết theo tagId
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

        // Tìm kiếm theo title, content, description hoặc theo tên chủ đề
        Promise.all([
            // Tìm kiếm theo nội dung bài viết
            fetch("http://localhost:3000/api/post/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: q, content: q, description: q }),
            }).then((res) => res.json()),
            // Tìm kiếm theo tên chủ đề
            searchByTopicName(q),
        ])
            .then(([postResult, postsByTopic]) => {
                // Gộp kết quả và loại bỏ trùng lặp (nếu cần)
                const posts1 = postResult.data || [];
                const posts2 = postsByTopic || [];
                // Loại bỏ trùng lặp theo postId
                const allPosts = [...posts1, ...posts2].filter(
                    (post, index, self) =>
                        index === self.findIndex((p) => p.postId === post.postId)
                );
                setPosts(allPosts);
            })
            .finally(() => setLoading(false));
    }, [q]);

    return (
        <div className="container mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold mb-4">Kết quả tìm kiếm cho: "{q}"</h2>
            {loading && <p>Đang tải...</p>}
            {!loading && posts.length === 0 && <p>Không tìm thấy bài viết phù hợp.</p>}
            <ul>
                {posts.map((post: any) => (
                    <li key={post.postId} className="mb-4 border-b pb-2">
                        <a href={`/posts/${post._id}`} className="text-blue-600 font-semibold hover:underline">
                            {post.title}
                        </a>
                        <p className="text-gray-600">{post.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}