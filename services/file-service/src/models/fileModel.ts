import { Schema, model, Document } from "mongoose";

interface IFile extends Document {
    fileId: string;
    userId: string;
    fileName: string;
    fileNameOriginal: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const fileSchema = new Schema({
    fileId: {type: String},
    userId: { type: String, required: true },
    fileName: { 
        type: String,
        required: [true, "Tên file không được để trống"],
        minlength: [1, "Tên file phải có ít nhất 1 ký tự"],
        maxlength: [100, "Tên file không được vượt quá 100 ký tự"],
        trim: true
    },
    fileNameOriginal: {
        type: String,
        required: [true, "Tên file gốc không được để trống"],
        minlength: [1, "Tên file gốc phải có ít nhất 1 ký tự"],
        maxlength: [100, "Tên file gốc không được vượt quá 100 ký tự"],
        trim: true
    },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileUrl: { type: String, required: true }
},
    { timestamps: true }
);

fileSchema.pre('save', async function(next) {
    if (!this.fileId) {
        this.fileId = this._id.toString();
    }
    next();
});

const fileModel = model<IFile>("File", fileSchema);

export { IFile , fileModel};