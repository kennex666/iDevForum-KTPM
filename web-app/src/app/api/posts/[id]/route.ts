// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
	const postId = parseInt(params.id);

	const mockPost = {
		postId,
		title: "Hướng sự kiện Java cơ bản cùng NetBeans",
		description: "Giới thiệu Java Event trong 5 phút",
		content: `
# Sự kiện trong Java

Trong Java, các sự kiện được quản lý qua listener. Ví dụ:

\`\`\`java
button.addActionListener(new ActionListener() {
	public void actionPerformed(ActionEvent e) {
		System.out.println("Clicked!");
	}
});
\`\`\`

> Rất dễ đúng không?

Hãy tiếp tục khám phá nhiều hơn.
		`,
		date: "Apr 17, 2024",
		topic: { name: "Java" },
		author: {
			userId: 1,
			name: "Dương Thái Bảo",
			profilePicture: "https://placehold.co/32x32",
		},
		comments: [],
        totalUpVote: 100,
        totalDownVote: 50,
        totalComments: 0,
        isOwner: true,
	};

	return NextResponse.json({
		errorCode: 200,
		data: {
			post: mockPost,
			reaction: "",
		},
	});
}
