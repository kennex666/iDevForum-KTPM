
import { IBookmark, BookmarkModel } from "../models/bookmarkModel";

class BookMarkService {

    async getAllBookmarks(): Promise<IBookmark[]> {
        try {
            const bookmarks = await BookmarkModel.find();
            return bookmarks;
        } catch (error) {
            throw new Error("Error fetching bookmarks: " + error);
        }
    }

    async getBookmarkById(bookmarkId: string): Promise<IBookmark | null> {
        try {
            const bookmark = await BookmarkModel.findById(bookmarkId);
            return bookmark;
        } catch (error) {
            throw new Error("Error fetching bookmark: " + error);
        }   
    }
    async createBookmark(bookmarkData: {
        userId: string;
        postId: string;
    }): Promise<IBookmark> {
        try {
            const newBookmark = new BookmarkModel(bookmarkData);
            return await newBookmark.save();
        } catch (error) {
            throw new Error("Error creating bookmark: " + error);
        }
    }
    async updateBookmark(bookmarkId: string, postId: String): Promise<IBookmark | null> {
        try {
            const updatedBookmark = await BookmarkModel.findByIdAndUpdate(bookmarkId, {postId}, { new: true });
            return updatedBookmark;
        } catch (error) {
            throw new Error("Error updating bookmark: " + error);
        }
    }
    async deleteBookmark(bookmarkId: string): Promise<IBookmark | null> {
        try {
            const deletedBookmark = await BookmarkModel.findByIdAndDelete(bookmarkId);
            return deletedBookmark;
        } catch (error) {
            throw new Error("Error deleting bookmark: " + error);
        }
    }
    async searchBookmarks(query: any): Promise<IBookmark[]> {
        try {
            return await BookmarkModel.find(query)
        } catch (error) {
            throw new Error("Error searching bookmarks: " + error);
        }
    }
}
export default new BookMarkService();