"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
	const searchParams = useSearchParams();
	const noti = searchParams.get("noti");

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
						Quên mật khẩu iDev4rum
					</h1>
					<p className="text-gray-500 text-center mb-4">
						Vui lòng nhập email để tiếp tục
					</p>

					<form method="POST" action="/api/forgot-password">
						<div className="flex flex-col gap-4">
							<label htmlFor="email" className="text-gray-500">
								Tên đăng nhập (Email)
							</label>
							<input
								name="email"
								type="text"
								id="email"
								className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
								placeholder="Tên đăng nhập"
								required
							/>

							{/* Thông báo nếu có */}
							{noti && (
								<p className="text-blue-500 text-sm mb-4">
									{decodeURIComponent(noti)}
								</p>
							)}

							<button
								type="submit"
								className="bg-blue-500 text-white rounded-lg p-2 focus:outline-none hover:bg-blue-400"
							>
								Tiếp tục
							</button>

							<div className="flex flex-row justify-between items-center">
								<Link href="/login" className="text-blue-500">
									Đăng nhập
								</Link>
								<Link
									href="/register"
									className="text-blue-500"
								>
									Đăng ký tài khoản
								</Link>
							</div>
						</div>
					</form>

					{/* Copyright */}
					<Footer/>
				</div>
			</div>
		</div>
	);
}
