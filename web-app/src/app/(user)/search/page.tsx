"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!q) return;
        setLoading(true);
        fetch("http://localhost:3000/api/post/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: q, content: q, describetion: q }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Kết quả API:", data); // Thêm dòng này để kiểm tra dữ liệu trả về
                setPosts(data.data || []);
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