"use client";

import Footer from "@/components/Footer";
import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { api, apiParser } from "@/constants/apiConst";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
export default function Home() {
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [form, setForm] = useState({ username: "", password: "" });

	const { setUser, setIsLogin } = useUser();

	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Kiểm tra dữ liệu đầu vào
			if (form.username === "") {
				setError("Vui lòng nhập tên đăng nhập");
				return;
			}
			if (form.password === "") {
				setError("Vui lòng nhập mật khẩu");
				return;
			}
			if (form.password.length < 6) {
				setError("Mật khẩu phải có ít nhất 6 ký tự");
				return;
			}
			
			setError("");

			// Giả lập gọi API
			const response = await axios.post(apiParser(api.apiPath.auth.login), {
				email: form.username,
				password: form.password,
			});
			console.log(response.data);

			// Kiểm tra phản hồi từ API
			if (response.data.errorCode != 200){
				setError(response.data.errorMessage);
				return;
			}

			// Lưu thông tin người dùng vào cookies
			document.cookie = `accessToken=${response.data.data.accessToken}; path=/`;

			setUser(response.data.data);
			setIsLogin(true);
			
			router.push("/home");
		} catch (error) {
			console.error("Đã xảy ra lỗi:", error);
			setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
		}
	};

	return (
		<div className="flex flex-row min-h-screen">
			<div className="w-8/12">
				<img
					src="https://i.ytimg.com/vi/6RzQvN238vQ/maxresdefault.jpg"
					alt="iDev4rum logo"
					className="object-cover min-h-full w-full"
				/>
			</div>
			<div className="w-4/12 flex flex-col items-center justify-center px-6 min-h-full pt-3">
				<div className="flex flex-col w-full max-w-sm">
					<h1 className="text-2xl font-bold uppercase text-center mt-2 mb-4">
						Đăng nhập iDev4rum
					</h1>
					<p className="text-gray-500 text-center mb-4">
						Tiếp tục đăng nhập để kết nối nhiều hơn nữa
					</p>

					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-4 mt-6">
							<label
								htmlFor="username"
								className="text-gray-500 flex items-center gap-2"
							>
								<FaUser /> Tên đăng nhập
							</label>
							<input
								type="text"
								id="username"
								value={form.username}
								onChange={handleChange}
								className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
								placeholder="Nhập email của bạn"
							/>

							<label
								htmlFor="password"
								className="text-gray-500 flex items-center gap-2"
							>
								<FaLock /> Mật khẩu
							</label>
							<div className="relative flex flex-row w-full">
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									value={form.password}
									onChange={handleChange}
									className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
									placeholder="Nhập mật khẩu của bạn"
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute text-gray-500 rounded-lg p-2 focus:outline-none z-10 right-2 h-full"
								>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>

							{error && (
								<p className="text-red-500 text-sm">{error}</p>
							)}

							<div className="flex items-center gap-2">
								<input type="checkbox" id="remember" />
								<label
									htmlFor="remember"
									className="text-gray-500"
								>
									Ghi nhớ đăng nhập
								</label>
							</div>

							<button
								type="submit"
								className="bg-blue-500 text-white rounded-lg p-2 focus:outline-none hover:bg-blue-400"
							>
								Đăng nhập
							</button>

							<div className="flex flex-row justify-between items-center text-sm mt-6">
								<a href="register" className="text-blue-500">
									Đăng ký tài khoản
								</a>
								<a
									href="forgot-password"
									className="text-blue-500"
								>
									Quên mật khẩu
								</a>
							</div>
						</div>
					</form>

					<Footer />
				</div>
			</div>
		</div>
	);
}
