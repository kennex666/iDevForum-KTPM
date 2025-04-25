import { PostModel, IPost } from "../models/postModel";
import { PostStatus } from "../models/postStatus";
import { UserClient } from '../clients/users';
const getPosts = async (): Promise<IPost[]> => {
    return await PostModel.find();
}

const createPost = async (postData: {
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


const getPostById = async (id: string): Promise<{ post: IPost | null; user: any | null }> => {
    try {
        const post = await PostModel.findById(id);

        if (!post) {
            return { post: null, user: null }; // Trả về null nếu không tìm thấy bài viết
        }

        const user = await UserClient.getUserById(post.userId.toString()).catch(() => null);

        return {
            post: post.toObject(), // Chuyển đổi bài viết thành đối tượng thuần túy
            user: user?.data || null // Trả về thông tin người dùng hoặc null nếu không tìm thấy
        };
    } catch (error) {
        console.error("Error while fetching post:", error);
        throw new Error("Không thể tìm thấy bài đăng. Vui lòng thử lại sau.");
    }
};

const updatePost = async (id:String,title: string,description: string,content: string,url: string): Promise<IPost | null> => {
   try {
    return await PostModel.findByIdAndUpdate(id, {title,description,content,url}, { new: true });  // new: true returns the updated document
   } catch (error) {
       console.error("Error while updating post:", error);
       throw new Error("Không thể cập nhật bài đăng. Vui lòng thử lại sau.");
    
   }
}
const deletePost = async (id: string): Promise<boolean> => {
    try {
        const result = await PostModel.findByIdAndDelete(id);
        return result !== null;
    } catch (error) {
        console.error("Error while deleting post:", error);
        throw new Error("Không thể xóa bài đăng. Vui lòng thử lại sau.");
        
    }
}

const searchPost = async (query: any): Promise<IPost[]> => {
    try {
        const post = await PostModel.find(query); // Use the query object directly
        return post;
    } catch (err) {
        console.error("Error while searching post:", err);
        throw new Error("Không thể tìm kiếm bài đăng. Vui lòng thử lại sau.");
    }
};
export { createPost, getPosts, getPostById, updatePost, deletePost , searchPost};