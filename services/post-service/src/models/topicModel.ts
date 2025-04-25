import { Schema,model, Document } from "mongoose";

interface ITopic extends Document{
    tagId: String,
    name: String,
    hashtag: String,
    createdAt: Date,
    updatedAt: Date,
}

const topicSchema = new Schema({
    tagId: { type: String },
    name: { type: String, required: true },
    hashtag: { type: String, required: true },
}, {
    timestamps: true,
});

topicSchema.pre<ITopic>("save", function (next) {
    if (this.isNew || this.tagId === undefined) {
        this.tagId = this._id+"";
    }
    next();
});

const TopicModel = model<ITopic>("Topic", topicSchema);
export { TopicModel, ITopic };