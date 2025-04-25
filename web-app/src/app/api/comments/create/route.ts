// app/api/comments/create/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();
	return NextResponse.json({
		errorCode: 200,
		data: {
			user: {
				name: "Dương Thái Bảo",
				profilePicture: "https://placehold.co/40x40",
			},
			content: body.content,
			createdAt: new Date().toLocaleString("vi-VN"),
		},
	});
}

export async function GET(req: Request) {
	return NextResponse.json({
		errorCode: 200,
		data: [
			{
				user: {
					name: "Dương Thái Bảo",
					profilePicture: "https://placehold.co/40x40",
				},
				content: "Đây là bình luận đầu tiên",
				createdAt: new Date().toLocaleString("vi-VN"),
			},
			{
				user: {
					name: "Nguyễn Văn A",
					profilePicture: "https://placehold.co/40x40",
				},
				content: "Đây là bình luận thứ hai",
				createdAt: new Date().toLocaleString("vi-VN"),
			},
		],
	});
}