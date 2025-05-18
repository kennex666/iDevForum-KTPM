import { Schema,model,Document } from "mongoose";

interface IBookmark extends Document {
    bookmarkId: string;
    userId: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
}
const bookmarkSchema = new Schema<IBookmark>({
    bookmarkId: { type: String },
    userId: { type: String, required: true },
    postId: { type: String, required: true },
},
{
    timestamps: true,
});

bookmarkSchema.pre("save", function (next) {
    if(this.isNew || this.bookmarkId === undefined){
        this.bookmarkId = this._id+"";
    }
    next();
});
const BookmarkModel = model<IBookmark>("Bookmark", bookmarkSchema);
export { BookmarkModel, IBookmark };