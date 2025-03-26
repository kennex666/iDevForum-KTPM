import { PostModel, IPost } from "../models/postModel";
import { PostStatus } from "../models/postStatus";

const getPosts = async (): Promise<IPost[]> => {
    return await PostModel.find();
}

const createPost = async (postData: {
    postId: string;
    title: string;
    description: string;
    content: string;
    url: string;
    status: PostStatus;
    totalComments: number;
    totalUpvote: number;
    totalDownvote: number;
    totalShare: number;
    totalView: number;
    userId: string;
    tagId: string;
}): Promise<IPost> => {
    try {
        const post = new PostModel(postData);
        return await post.save();
    } catch (err) {
        console.error("Error creating post:", err);
        if (err instanceof Error) {
            throw new Error("Không thể tạo bài viết. Vui lòng thử lại sau.");
        } else {
            throw new Error("Lỗi không xác định. Vui lòng thử lại sau.");
        }
    }
};


const getPostById = async (id: string): Promise<IPost | null> => {
    return await PostModel.findById(id);
}

const updatePost = async (id:String,title: string,description: string,content: string,url: string): Promise<IPost | null> => {
    return await PostModel.findByIdAndUpdate(id, {title,description,content,url}, { new: true });  // new: true returns the updated document
}
const deletePost = async (id: string): Promise<boolean> => {
    const result = await PostModel.findByIdAndDelete(id);
    return result !== null;
}
export { createPost, getPosts, getPostById, updatePost, deletePost };