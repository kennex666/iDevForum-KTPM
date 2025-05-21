"use client";

import { useState, useRef, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	FaSearch,
	FaPen,
	FaBell,
	FaUser,
	FaBookmark,
	FaLock,
	FaSignOutAlt,
	FaTimes,
} from "react-icons/fa";
import { EUserRole, useUser } from "@/context/UserContext";
import Toast from "../Toast";
import { getAccessToken } from "@/app/utils/cookiesParse";
import { apiParser, api } from '../../constants/apiConst';

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isChangePassword, setIsChangePassword] = useState(false);
	const searchRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const { user, isLogin } = useUser();

	// Toát
	const [toastType, setToastType] = useState("error");
	const [showToast, setShowToast] = useState("");

	const handleSearchKeyPress = async (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Enter" && searchRef.current) {
			const keyword = searchRef.current.value.trim();
			if (keyword) {
				router.push(`/search?q=${keyword}`);
			}
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const oldPassword = formData.get("oldPassword") as string;
		const newPassword = formData.get("newPassword") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		if (newPassword !== confirmPassword) {
			setToastType("error");
			setShowToast("Mật khẩu mới không khớp");
			return;
		}

		try {
			const response = await fetch(`${apiParser(api.apiPath.user.updatePassword)}`, {
				method: "PUT",
				body: JSON.stringify({ oldPassword, newPassword }),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getAccessToken()}`,
				},
			});
			const data = await response.json();
			
			if (data.errorCode == 200) {
				setShowToast(
					"Đổi mật khẩu thành công. Vui lòng đăng nhập lại!"
				);
				setToastType("success");
				setIsChangePassword(false);

				// Đăng xuất người dùng
				setTimeout(() => {
					window.location.href = "/logout";
				}, 2000);
			} else {
				setToastType("error");
				setShowToast(data.errorMessage || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
			}
		} catch (error) {
			console.error(error);
			setToastType("error");
			setShowToast("Có lỗi xảy ra. Vui lòng thử lại.");
		}
	};

	return (
		<header className="bg-white px-20 py-4 flex justify-between items-center">
			{/* Logo + Search */}
			{/* Mở model đổi password: Nhập pass cũ, hai lần password mới, và nút đổi password */}

			{showToast && (
				<Toast
					message={showToast}
					type={(toastType as any) || "error"}
				/>
			)}
			{isChangePassword && (
				<div className="fixed inset-0 flex items-center justify-center z-[25]">
					<div
						onClick={() => setIsChangePassword(false)}
						className="fixed inset-0 bg-gray-700 opacity-50 flex items-center justify-center z-[23]"
					></div>
					<div className="fixed inset-0 flex items-center justify-center z-[25]">
						<div className="bg-white p-6 rounded-lg shadow-lg w-[40vw]">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-lg font-semibold">
									Đổi mật khẩu
								</h2>
								{/* Nút đóng */}
								<button
									onClick={() => setIsChangePassword(false)}
									className="text-gray-500 hover:text-gray-700 focus:outline-none"
								>
									<FaTimes />
								</button>
							</div>
							{/* Form đổi mật khẩu */}
							<form onSubmit={handleChangePassword}>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2">
										Mật khẩu cũ
									</label>
									<input
										name="oldPassword"
										type="password"
										className="border rounded w-full py-2 px-3"
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2">
										Mật khẩu mới
									</label>
									<input
										name="newPassword"
										type="password"
										className="border rounded w-full py-2 px-3"
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2">
										Nhập lại mật khẩu mới
									</label>
									<input
										name="confirmPassword"
										type="password"
										className="border rounded w-full py-2 px-3"
									/>
								</div>
								<button
									type="submit"
									className="bg-blue-500 text-white px-4 py-2 rounded"
								>
									Đổi mật khẩu
								</button>
							</form>
						</div>
					</div>
				</div>
			)}
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
						<a
							href="/notification"
							className="text-gray-500 focus:outline-none space-x-2 flex items-center"
						>
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
										{isLogin && (
											<a
												href="#"
												className="block px-4 py-2 text-sm text-gray-700 flex items-center"
												onClick={() =>
													setIsChangePassword(
														!isChangePassword
													)
												}
											>
												<FaLock />
												<span className="ps-3">
													Đổi mật khẩu
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
