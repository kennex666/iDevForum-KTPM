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
	FaRightFromBracket,
} from "react-icons/fa";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const searchRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && searchRef.current) {
			const keyword = searchRef.current.value;
			router.push(`/search?q=${encodeURIComponent(keyword)}`);
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
				<a
					href="/write"
					className="text-gray-500 focus:outline-none space-x-2 flex items-center"
				>
					<FaPen />
					<span>Viết bài</span>
				</a>
				<button className="text-gray-500 focus:outline-none">
					<FaBell />
				</button>

				{/* Profile Dropdown */}
				<div className="relative">
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="rounded-full"
					>
						<img
							src="https://placehold.co/32x32"
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
									<span className="ps-3">Hồ sơ</span>
								</a>
								<a
									href="/admin"
									className="block px-4 py-2 text-sm text-gray-700 flex items-center"
								>
									<FaBookmark />
									<span className="ps-3">
										Bài viết đã lưu
									</span>
								</a>
								<a
									href="/admin"
									className="block px-4 py-2 text-sm text-gray-700 flex items-center"
								>
									<FaLock />
									<span className="ps-3">Trang quản trị</span>
								</a>
								<a
									href="/logout"
									className="border-t block px-4 py-2 text-sm font-semibold mt-2 pt-4 text-red-500 flex items-center"
								>
									<FaRightFromBracket />
									<span className="ps-3">Đăng xuất</span>
								</a>
							</div>
						</div>
					)}
				</div>
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
