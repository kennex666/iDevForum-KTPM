"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { api, apiParser } from "@/constants/apiConst";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const [form, setForm] = useState({
		fullname: "",
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({
		fullname: "",
		email: "",
		password: "",
		global: "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.id]: e.target.value });
		setErrors({ ...errors, [e.target.id]: "", global: "" });
	};

	const validate = () => {
		let hasError = false;
		const newErrors = { fullname: "", email: "", password: "", global: "" };

		if (!form.fullname.trim()) {
			newErrors.fullname = "Vui lòng nhập họ và tên";
			hasError = true;
		}

		if (!form.email.trim()) {
			newErrors.email = "Vui lòng nhập email";
			hasError = true;
		} else if (!/\S+@\S+\.\S+/.test(form.email)) {
			newErrors.email = "Email không hợp lệ";
			hasError = true;
		}

		if (!form.password.trim()) {
			newErrors.password = "Vui lòng nhập mật khẩu";
			hasError = true;
		} else if (form.password.length < 6) {
			newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";
			hasError = true;
		}

		setErrors(newErrors);
		return !hasError;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		try {
			e.preventDefault();
			setErrors({ fullname: "", email: "", password: "", global: "" });

			if (!validate()) return;

			setLoading(true);

			// Giả lập gọi API
			const response = await axios.post(apiParser(api.apiPath.auth.register), {
				email: form.email,
				name: form.fullname,
				password: form.password,
			});

			// Kiểm tra phản hồi từ API
			const data = response.data;

			// Giả lập lỗi từ server nếu email là 'test@example.com'
			if (data.errorCode !== 200) {
				setErrors((prev) => ({
					...prev,
					global: data.errorMessage,
				}));
				return;
			}
			
			router.push("/login");

			setLoading(false);
		} catch (error) {
			console.error("Đã xảy ra lỗi:", error);
			setLoading(false);
			setErrors((prev) => ({
				...prev,
				global: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
			}));
		}
	};

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

					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-4">
							{/* Họ và tên */}
							<label
								htmlFor="fullname"
								className="text-gray-500 flex items-center gap-2"
							>
								<FaUser /> Họ và tên
							</label>
							<input
								type="text"
								id="fullname"
								value={form.fullname}
								onChange={handleChange}
								className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
								placeholder="Họ và tên"
							/>
							{errors.fullname && (
								<p className="text-red-500 text-sm">
									{errors.fullname}
								</p>
							)}

							{/* Email */}
							<label
								htmlFor="email"
								className="text-gray-500 flex items-center gap-2"
							>
								<FaEnvelope /> Email
							</label>
							<input
								type="email"
								id="email"
								value={form.email}
								onChange={handleChange}
								className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
								placeholder="Email"
							/>
							{errors.email && (
								<p className="text-red-500 text-sm">
									{errors.email}
								</p>
							)}

							{/* Mật khẩu */}
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
									placeholder="Mật khẩu"
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword((prev) => !prev)
									}
									className="absolute text-gray-500 p-2 z-10 right-2 top-1/2 -translate-y-1/2"
								>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
							{errors.password && (
								<p className="text-red-500 text-sm">
									{errors.password}
								</p>
							)}

							{/* Lỗi toàn cục */}
							{errors.global && (
								<p className="text-red-500 text-sm">
									{errors.global}
								</p>
							)}

							<button
								type="submit"
								disabled={loading}
								className={`bg-blue-500 text-white rounded-lg p-2 focus:outline-none hover:bg-blue-400 mt-4 ${
									loading
										? "opacity-60 cursor-not-allowed"
										: ""
								}`}
							>
								{loading ? "Đang xử lý..." : "Tạo tài khoản"}
							</button>

							<div className="flex flex-row justify-between items-center mt-2 text-sm">
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

					<Footer />
				</div>
			</div>
		</div>
	);
}
