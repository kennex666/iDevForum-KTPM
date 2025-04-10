import { fileModel, IFile } from "../models/fileModel";

/**
 * File service interface
 */
interface IFileService {
    getFileById(id: string): Promise<IFile | null>;
    uploadImage(data: any): Promise<IFile>;
    uploadPdf(data: any): Promise<IFile>;
}

/**
 * Custom error class for file service
 */
class FileServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FileServiceError';
    }
}

/**
 * File service implementation
 */
class FileService implements IFileService {
    /**
     * Get file by ID
     */
    async getFileById(id: string): Promise<IFile | null> {
        try {
            return await fileModel.findOne({ fileId: id });
        } catch (error) {
            this.handleError(error, 'Lỗi khi lấy file');
        }
        return null;
    }

    /**
     * Upload image file
     */
    async uploadImage(data: any): Promise<IFile> {
        try {
            const file = new fileModel({
                userId: data.userId,
                fileName: data.fileName,
                fileType: data.fileType,
                fileSize: data.fileSize,
                fileUrl: data.fileUrl
            });
            return await file.save();
        } catch (error) {
            this.handleError(error, 'Không thể tải lên ảnh');
        }
        throw new FileServiceError('Upload image failed due to an unknown error.');
    }

    /**
     * Upload PDF file
     */
    async uploadPdf(data: any): Promise<IFile> {
        try {
            const file = new fileModel({
                userId: data.userId,
                fileName: data.fileName,
                fileType: data.fileType,
                fileSize: data.fileSize,
                fileUrl: data.fileUrl
            });
            return await file.save();
        } catch (error) {
            this.handleError(error, 'Không thể tải lên PDF');
        }
        throw new FileServiceError('Upload PDF failed due to an unknown error.');
    }

    /**
     * Handle errors
     */
    private handleError(error: any, message: string): void {
        console.error(error);
        throw new FileServiceError(message);
    }
};
