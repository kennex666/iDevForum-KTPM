import { useState } from "react";
import axios from "axios";
import { getAccessToken } from "@/app/utils/cookiesParse";
import { api, apiParser } from "@/constants/apiConst";

export default function UpdateUserModal({
	onClose,
	currentUser,
	onUpdated,
    setToast
}: any) {
	const [form, setForm] = useState({
		name: currentUser.name || "",
		bio: currentUser.bio || "",
		description: currentUser.description || "",
		profilePicture: currentUser.profilePicture || "",
		coverPicture: currentUser.coverPicture || "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "profilePicture" | "coverPicture"
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		try {
			const res = await axios.post(
				apiParser(api.apiPath.upload.uploadImage),
				formData,
				{
					headers: {
						Authorization: `Bearer ${getAccessToken()}`,
					},
				}
			);
            if (res.data.errorCode != 200) {
                setToast({
					type: "error",
					message: res.data.errorMessage,
				});
            } else {
                if (res.data?.data.fileUrl) {
                    setForm((prev) => ({
						...prev,
						[type]: res.data?.data.fileUrl.replace(
							"http://localhost:3000",
							api.protocol + "://" + api.domain.client
						),
					}));
                    
                    setToast({
						type: "success",
						message: "Đã upload hình ảnh. Nhấn lưu để áp dụng!",
					});
                } else {
                    
                    setToast({
                        type: "error",
                        message: "Upload thành công, nhưng không tìm thấy hình ảnh",
                    });
                }
            }
		} catch (error) {
			console.error("Upload failed:", error);
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const result = await axios.put(
				apiParser(api.apiPath.user.updateNew),
				form,
				{
					headers: {
						Authorization: `Bearer ${getAccessToken()}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (result.data.errorCode != 200) {
                setToast({
                    type: "error",
                    message: result.data.errorMessage
                })
                return;
			} else {
                setToast({
                    type: "success",
                    message: "Cập nhật hồ sơ thành công"
                })
            }
			onUpdated();
			onClose();
		} catch (error) {
			console.error("Update failed:", error);
		}
		setLoading(false);
	};

	return (
		<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
			<div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
				<button
					onClick={onClose}
					className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
				>
					×
				</button>

				{/* Cover + Avatar chung 1 khối */}
				<div className="relative w-full h-44 rounded-lg overflow-hidden bg-gray-100 mb-6">
					{form.coverPicture ? (
						<img
							src={form.coverPicture}
							className="w-full h-full object-cover"
							alt="Ảnh bìa"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-gray-400">
							Ảnh bìa
						</div>
					)}

					{/* Nút thay ảnh bìa */}
					<label className="absolute top-2 right-2 bg-white/80 hover:bg-white text-sm px-3 py-1 rounded shadow cursor-pointer transition">
						Thay ảnh bìa
						<input
							type="file"
							accept="image/*"
							onChange={(e) => handleUpload(e, "coverPicture")}
							className="hidden"
						/>
					</label>

					{/* Avatar chèn lên bìa */}
					<div className="absolute bottom-0 left-6">
						<div className="relative w-24 h-24">
							<img
								src={form.profilePicture}
								className="w-24 h-24 object-cover rounded-full border-4 border-white shadow"
								alt="Avatar"
							/>
							<label className="absolute bottom-0 right-0 bg-white p-1 rounded-full border shadow cursor-pointer hover:bg-gray-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-4 h-4 text-gray-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L18 9.828M9 13h.01"
									/>
								</svg>
								<input
									type="file"
									accept="image/*"
									onChange={(e) =>
										handleUpload(e, "profilePicture")
									}
									className="hidden"
								/>
							</label>
						</div>
					</div>
				</div>

				{/* Form fields */}
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Tên
						</label>
						<input
							name="name"
							value={form.name}
							onChange={handleChange}
							className="mt-1 w-full border rounded px-3 py-2"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Tiểu sử ngắn (bio)
						</label>
						<input
							name="bio"
							value={form.bio}
							onChange={handleChange}
							className="mt-1 w-full border rounded px-3 py-2"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Giới thiệu bản thân (description)
						</label>
						<textarea
							name="description"
							value={form.description}
							onChange={handleChange}
							className="mt-1 w-full border rounded px-3 py-2 h-28"
						/>
					</div>
				</div>

				{/* Actions */}
				<div className="mt-6 flex justify-end gap-3">
					<button
						onClick={onClose}
						className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
					>
						Hủy
					</button>
					<button
						onClick={handleSubmit}
						disabled={loading}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					>
						{loading ? "Đang lưu..." : "Lưu thay đổi"}
					</button>
				</div>
			</div>
		</div>
	);
}
