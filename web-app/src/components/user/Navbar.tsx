"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
	FaSearch,
	FaPen,
	FaBell,
	FaUser,
	FaBookmark,
	FaLock,
	FaSignOutAlt,
} from "react-icons/fa";
import { EUserRole, useUser } from "@/context/UserContext";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const searchRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const {user, isLogin} = useUser();
	

	const handleSearchKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchRef.current) {
        const keyword = searchRef.current.value.trim();
        if (!keyword) return;

        // Gửi request tìm kiếm đến backend
        const res = await fetch("http://localhost:3000/api/post/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: keyword,
                content: keyword,
				describetion: keyword,
				
            }),
        });
        const result = await res.json();

        // Chuyển trang với kết quả tìm kiếm (hoặc xử lý kết quả tại chỗ)
        if (result.errorCode === 200) {
            // Ví dụ: chuyển trang và truyền kết quả qua query (hoặc lưu vào state/context)
            router.push(`/search?q=${encodeURIComponent(keyword)}`);
        } else {
            // Xử lý lỗi nếu cần
            alert(result.errorMessage || "Không tìm thấy bài viết phù hợp.");
        }
    }
};

	return (
		<header className="bg-white px-20 py-4 flex justify-between items-center">
			{/* Logo + Search */}
			<div className="flex items-center justify-center space-x-10">
				<a href="/">
					<h1 className="text-2xl font-bold">iDev4rum</h1>
				</a>

				<div className="flex items-center bg-gray-100 rounded-full px-4 py-2 transition-all duration-300 focus-within:w-64">
					<FaSearch className="text-gray-500" />
					<input
						type="text"
						placeholder="Tìm kiếm..."
						ref={searchRef}
						onKeyPress={handleSearchKeyPress}
						className="bg-transparent focus:outline-none ml-4 transition-all w-full"
					/>
				</div>
			</div>

			{/* Actions */}
			<div className="flex items-center space-x-10">
				{/* Profile Dropdown */}
				{isLogin && (
					<>
						<a
							href="/write"
							className="text-gray-500 focus:outline-none space-x-2 flex items-center"
						>
							<FaPen />
							<span>Viết bài</span>
						</a>
						<a  href="/notification" className="text-gray-500 focus:outline-none space-x-2 flex items-center">
							<FaBell />
							<span>Thông báo</span>
						</a>
						<div className="relative">
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="rounded-full"
							>
								<img
									src={
										user?.profilePicture ||
										"https://placehold.co/50x50"
									}
									alt="User profile"
									className="w-8 h-8 rounded-full"
								/>
							</button>
							{isMenuOpen && (
								<div
									className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 animate-fadeIn"
									role="menu"
								>
									<div className="py-1 space-y-1">
										<a
											href="/profile"
											className="block px-4 py-2 text-sm text-gray-700 flex items-center"
										>
											<FaUser />
											<span className="ps-3">
												Trang cá nhân
											</span>
										</a>
										{isLogin && (
											<a
												href="/bookmark"
												className="block px-4 py-2 text-sm text-gray-700 flex items-center"
											>
												<FaBookmark />
												<span className="ps-3">
													Bài viết đã lưu
												</span>
											</a>
										)}
										{isLogin &&
											user.role == EUserRole.ADMIN && (
												<a
													href="/dashboard"
													className="block px-4 py-2 text-sm text-gray-700 flex items-center"
												>
													<FaLock />
													<span className="ps-3">
														Trang quản trị
													</span>
												</a>
											)}
										<a
											href="/logout"
											className="border-t block px-4 py-2 text-sm font-semibold mt-2 pt-4 text-red-500 flex items-center"
										>
											<FaSignOutAlt />
											<span className="ps-3">
												Đăng xuất
											</span>
										</a>
									</div>
								</div>
							)}
						</div>
					</>
				)}
				{/* Guest User */}
				{!isLogin && (
					<div className="flex gap-2">
						<a
							href="/login"
							className="text-blue-500 focus:outline-none space-x-2 flex items-center hover:underline transition-all duration-300"
						>
							<span>Đăng nhập</span>
						</a>
						/
						<a
							href="/register"
							className="text-blue-500 focus:outline-none space-x-2 flex items-center hover:underline transition-all duration-300"
						>
							<span>Đăng ký</span>
						</a>
					</div>
				)}
			</div>

			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.3s ease-in-out;
				}
			`}</style>
		</header>
	);
}
