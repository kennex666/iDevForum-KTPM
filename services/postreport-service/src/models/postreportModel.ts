import { Schema,model,Document } from "mongoose";
import { PostReportState } from "./postreportState";

interface IPostReport extends Document {
    postreportId: String;
    state: PostReportState;
    reason: String;
    cretaedAt: Date;
    updatedAt: Date;
    postId: String;
    reporterId: String;
    inspectorId: String;

}
const postreportSchema = new Schema({
    postreportId: { type: String },
    state: { type: String, enum: Object.values(PostReportState), required: true },
    reason: { type: String, required: true },
    postId: { type: String, required: true },
    reporterId: { type: String, required: true },
    inspectorId: { type: String},
},
{
    timestamps: true,
}
);
postreportSchema.pre<IPostReport>("save", function (next) {
    if (this.isNew || this.postreportId === undefined) {
        this.postreportId = this._id+"";
    }
    next();
});

const PostReportModel = model<IPostReport>("PostRepost", postreportSchema);

export { PostReportModel, IPostReport };