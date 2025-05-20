import { PostModel, IPost } from "../models/postModel";
import { BookMarkModel,IBookMark } from "../models/bookMarkModel";
import { PostStatus } from "../models/postStatus";
import { UserClient } from '../clients/users';
const getPosts = async (query: any, externalQuery: any) => {
    // Get post by offset and limit with full info (merge with authors...)
    const { offset = 0, limit = 100 } = query;
    const posts = await PostModel.find( externalQuery || {} ).skip(offset).limit(limit).sort({ createdAt: -1 }); // Sort by createdAt in descending order

    const count = await PostModel.countDocuments(externalQuery || {}); // Count total documents matching the query
    const postsWithAuthor = await Promise.all(
        posts.map(async (post: any) => {
            let author = null;
            try {
                const result = await UserClient.getUserById(post.userId.toString());
                author = result?.data || null;
            } catch (err) {
                console.error("Error fetching user by ID:", post.userId, err);
            }

            const plainPost =
                typeof post.toObject === "function" ? post.toObject() : post;
            return {
                ...plainPost,
                author,
            };
        })
    );

    return {data: postsWithAuthor, total: count}; // Return posts with author
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
            user: user?.data || null, // Trả về thông tin người dùng hoặc null nếu không tìm thấy
            author: user?.data || null // Trả về thông tin người dùng hoặc null nếu không tìm thấy
        } as { post: IPost | null; user: any | null; author: any | null };
    } catch (error) {
        console.error("Error while fetching post:", error);
        throw new Error("Không thể tìm thấy bài đăng. Vui lòng thử lại sau.");
    }
};

const updatePostByAdmin = async (
    id: string,
    title: string,
    description: string,
    content: string,
    url: string,
    status: PostStatus,
): Promise<IPost | null> => {
    try {
        const post = await PostModel.findByIdAndUpdate(
            id,
            {
                title,
                description,
                content,
                url,
                status
            },
            { new: true }
        );
        return post;
    } catch (error) {
        console.error("Error while updating post:", error);
        throw new Error("Không thể cập nhật bài đăng. Vui lòng thử lại sau.");
    }
}

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

const actionBookmark = async (userId: string, postId: string): Promise<IPost | null> => {
    try {
        const existingBookmark = await BookMarkModel.findOne({ userId, postId });
        if (existingBookmark) {
            await BookMarkModel
                .findOneAndDelete({ userId, postId })
                .then(() => {
                    console.log("Bookmark removed successfully");
                })
                .catch((err: any) => {
                    console.error("Error removing bookmark:", err);
                });
            return null;
        } else {
            const newBookmark = new BookMarkModel({ userId, postId });
            await newBookmark.save();
            return newBookmark; 
        }
    } catch (error) {
        console.error("Error while toggling bookmark:", error);
        throw new Error("Không thể thực hiện hành động đánh dấu. Vui lòng thử lại sau.");
    }
}
export { createPost, getPosts, getPostById, updatePost,actionBookmark, deletePost , searchPost, updatePostByAdmin};