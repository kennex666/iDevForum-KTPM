import { PostModel, IPost } from "../models/postModel";
const createPost = async (post: IPost): Promise<IPost> => {
    const newPost = new PostModel(post);
    return await newPost.save();
}
const getPosts = async (): Promise<IPost[]> => {
    return await PostModel.find();
}
const getPostById = async (id: string): Promise<IPost | null> => {
    return await PostModel.findById(id);
}
const updatePost = async (id: string, post: IPost): Promise<IPost | null> => {
    return await PostModel.findByIdAndUpdate(id, post, { new: true });  // new: true returns the updated document
}
const deletePost = async (id: string): Promise<IPost | null> => {
    return await PostModel.findByIdAndDelete(id);
}
export { createPost, getPosts, getPostById, updatePost, deletePost };