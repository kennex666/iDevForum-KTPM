export function toSlugWithTimestamp(title: string) {
	const slug = title
		.normalize("NFD") // Chuẩn hóa unicode
		.replace(/[\u0300-\u036f]/g, "") // Xoá dấu tiếng Việt
		.replace(/[^a-zA-Z0-9\s]/g, "") // Xoá ký tự đặc biệt
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-"); // Đổi khoảng trắng thành dấu gạch ngang

	const timestamp = Date.now(); // Lấy timestamp hiện tại

    // random 6 ký tự 
    const randomString = Math.random().toString(36).substring(2, 8);

	return `${timestamp}-${randomString}-${slug}`;
}
