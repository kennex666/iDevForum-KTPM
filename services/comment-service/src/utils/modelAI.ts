import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-1.5-flash",
  apiKey: 'AIzaSyBxjhQEWCXKJEIMUKAFo5AngEyi6usFXM0',
  maxOutputTokens: 2048
});

export async function generateResponse(prompt: string){
    try {
        const message = `
        Bạn là một người kiểm duyệt nội dung.
        Dưới đây là danh sách các bình luận người dùng:
        ${prompt}
        Hãy trả về ID của các bình luận vi phạm chính sách của chúng tôi.
        Chỉ trả về ID, không trả về bất kỳ thông tin nào khác.
        `;
        const response = await model.invoke(message);
        console.log(response.content)
        return response.content
    } catch (error) {
        console.error(error);
        return error instanceof Error ? error.message : 'Lỗi không xác định';
    }
}