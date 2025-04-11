"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="flex flex-row min-h-screen font-sans">
			<div className="w-8/12">
				<img
					src="https://i.ytimg.com/vi/6RzQvN238vQ/maxresdefault.jpg"
					alt="iDev4rum logo"
					className="object-cover min-h-full w-full"
				/>
			</div>

			<div className="w-4/12 flex flex-col items-center justify-center px-6 min-h-full pt-3">
				<div className="flex flex-col w-full max-w-md">
					<h1 className="text-2xl font-bold uppercase text-center mt-2 mb-4">
						Đăng ký tài khoản
					</h1>
					<p className="text-gray-500 text-center mb-4">
						Đăng ký tài khoản để tham gia cộng đồng iDev4rum
					</p>

					<form method="POST" action="/api/register">
						<div className="flex flex-col gap-2">
							<label htmlFor="fullname" className="text-gray-500">
								Họ và tên
							</label>
							<input
								type="text"
								id="fullname"
								className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
								placeholder="Họ và tên"
							/>

							{/* Lỗi fullname */}
							<p className="text-red-500">Lỗi: </p>

							<label htmlFor="email" className="text-gray-500">
								Email
							</label>
							<input
								type="email"
								id="email"
								className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
								placeholder="Email"
							/>

							{/* Lỗi email */}
							<p className="text-red-500">Lỗi: </p>

							<label htmlFor="password" className="text-gray-500">
								Mật khẩu
							</label>
							<div className="relative flex flex-row w-full">
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
									placeholder="Mật khẩu"
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword((prev) => !prev)
									}
									className="absolute text-gray-500 rounded-lg p-2 focus:outline-none z-10 right-2 h-full"
									id="btn-show"
								>
									<i
										className={`fas ${
											showPassword
												? "fa-eye-slash"
												: "fa-eye"
										}`}
									></i>
								</button>
							</div>

							{/* Lỗi mật khẩu */}
							<p className="text-red-500">Lỗi: </p>

							<button className="bg-blue-500 text-white rounded-lg p-2 focus:outline-none hover:bg-blue-400 mt-4">
								Tạo tài khoản
							</button>

							<div className="flex flex-row justify-between items-center mt-2">
								<Link href="/login" className="text-blue-500">
									Đăng nhập
								</Link>
								<Link
									href="/forgot-password"
									className="text-blue-500"
								>
									Quên mật khẩu
								</Link>
							</div>
						</div>
					</form>

					{/* Footer */}
					<Footer/>
				</div>
			</div>
		</div>
	);
}
