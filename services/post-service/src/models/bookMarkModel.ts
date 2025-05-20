import { Schema, model, Document } from "mongoose";

interface IBookMark extends Document {
    bookMarkId: string;
    postId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const bookMarkSchema = new Schema(
    {
        bookMarkId: { type: String },
        postId: { type: String, required: true },
        userId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

bookMarkSchema.pre<IBookMark>("save", function (next) {
    if (this.isNew || this.bookMarkId === undefined) {
        this.bookMarkId = this._id + "";
    }
    next();
});

const BookMarkModel = model<IBookMark>("BookMark", bookMarkSchema);
export { BookMarkModel, IBookMark };
export default BookMarkModel;