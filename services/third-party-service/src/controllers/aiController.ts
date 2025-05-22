import { Request, Response } from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: "",
});

const askGPT = async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
		model: "gpt-3.5-turbo", // or "gpt-4" if you have access
		messages: [
			{
				role: "system",
				content:
					"Bạn là một nhà văn, bạn có thể viết hướng dẫn về mọi lĩnh vực. Bạn luôn sử dụng Markdown cho mọi bài viết. Người dùng sẽ hỏi bạn, và nhiệm vụ của bạn là sử dụng ý tưởng đó để viết thành bài viết.",
			},
			{ role: "user", content: prompt },
		],
		temperature: 0.7,
	});

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      res.status(500).json({ error: "Error from OpenAI", details: (error as any).message });
    } else {
      res.status(500).json({ error: "Unknown error from OpenAI" });
    }
  }
};

const reviewPost = async (req: Request, res: Response) => {
	const { prompt } = req.body;

	if (!prompt) {
		return res.status(400).json({ error: "Prompt is required" });
	}

	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini", // Hoặc "gpt-4" nếu cần
			messages: [
				{
					role: "system",
					content:
						"Bạn là một người kiểm duyệt viên của trang diễn đàn. Bạn sẽ có nhiệm vụ kiểm soát người dùng có đang spam, đăng nội dung lăng mạ, nhạy cảm hay không. Bài viết không được ngắn, phải có ý nghĩa" +
						"\nBạn sẽ trả về chuỗi JSON và không giải thích gì thêm." +
						'\nChuỗi JSON, mẫu: {"status": 200, "message": "Bài đăng hợp lệ"}' +
						"\nStatus: 200 là duyệt bài, 400 là bài đăng bị từ chối. - message là lý do bị từ chối.",
				},
				{ role: "user", content: "âbsjahshaks" },
				{
					role: "assistant",
					content: '{"status": 400, "message": "Spam"}',
				},
				{ role: "user", content: "Tìm người yêu Sài Gòn" },
				{
					role: "assistant",
					content: '{"status": 400, "message": "Spam"}',
				},
				{ role: "user", content: "Sử dụng Netbeans" },
				{
					role: "assistant",
					content: '{"status": 400, "message": "Spam"}',
				},
				{
					role: "user",
					content:
						"JavaScript là một ngôn ngữ lập trình phổ biến và mạnh mẽ, chủ yếu được sử dụng để phát triển các trang web động...",
				},
				{
					role: "assistant",
					content: '{"status": 200, "message": "Bài đã được duyệt"}',
				},
				{ role: "user", content: prompt },
			],
			temperature: 0.3,
		});

		const reply = completion.choices[0].message.content;

		try {
			const parsed = JSON.parse(reply || "");
			return res.json(parsed);
		} catch (jsonError) {
			console.error("❌ Không parse được JSON từ GPT:", reply);
			return res.status(500).json({
				error: "GPT trả về không đúng định dạng JSON.",
				reply,
			});
		}
	} catch (error: unknown) {
		console.error("❌ Lỗi gọi OpenAI:", error);
		if (error && typeof error === "object" && "message" in error) {
			res.status(500).json({
				error: "Error from OpenAI",
				details: (error as any).message,
			});
		} else {
			res.status(500).json({ error: "Unknown error from OpenAI" });
		}
	}
};

export const reviewPostQueue = async (prompt: any) => {

	if (!prompt) {
		return {
			status:400,
			message: "Prompt is required"
		}
	}

	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini", // Hoặc "gpt-4" nếu cần
			messages: [
				{
					role: "system",
					content:
						"Bạn là một người kiểm duyệt viên của trang diễn đàn. Bạn sẽ có nhiệm vụ kiểm soát người dùng có đang spam, đăng nội dung lăng mạ, nhạy cảm hay không. Bài viết không được ngắn, phải có ý nghĩa" +
						"\nBạn sẽ trả về chuỗi JSON và không giải thích gì thêm." +
						'\nChuỗi JSON, mẫu: {"status": 200, "message": "Bài đăng hợp lệ"}' +
						"\nStatus: 200 là duyệt bài, 400 là bài đăng bị từ chối. - message là lý do bị từ chối.",
				},
				{ role: "user", content: "âbsjahshaks" },
				{
					role: "assistant",
					content: '{"status": 400, "message": "Spam"}',
				},
				{ role: "user", content: "Tìm người yêu Sài Gòn" },
				{
					role: "assistant",
					content: '{"status": 400, "message": "Spam"}',
				},
				{ role: "user", content: "Sử dụng Netbeans" },
				{
					role: "assistant",
					content: '{"status": 400, "message": "Spam"}',
				},
				{
					role: "user",
					content:
						"JavaScript là một ngôn ngữ lập trình phổ biến và mạnh mẽ, chủ yếu được sử dụng để phát triển các trang web động...",
				},
				{
					role: "assistant",
					content: '{"status": 200, "message": "Bài đã được duyệt"}',
				},
				{ role: "user", content: prompt },
			],
			temperature: 0.3,
		});

		const reply = completion.choices[0].message.content;

		try {
			const parsed = JSON.parse(reply || "");
			return parsed
		} catch (jsonError) {
			console.error("❌ Không parse được JSON từ GPT:", reply);
			return {
				status: 500,
				message: "GPT trả về không đúng định dạng JSON."
			};
		}
	} catch (error: unknown) {
		console.error("❌ Lỗi gọi OpenAI:", error);
		return {
			status: 500,
			message: "GPT lỗi!"
		}
	}
};

export { askGPT, reviewPost };