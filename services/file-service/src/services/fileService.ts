import { fileModel, IFile } from "../models/fileModel";
import uploadFile from "../helper/file.helper";
import multer from "multer";
import { Request } from "express";

/**
 * File service interface
 */
interface IFileService {
    uploadImage(data: any): Promise<IFile>;
    uploadPdf(data: any): Promise<IFile>;
    uploadVideo(data: any): Promise<IFile>;
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
     * Upload image file
     */
    async uploadImage(data: any): Promise<IFile> {
        try {
            console.log('Uploading image... in fileService');
            console.log('Data:', data);
            // Upload file to storage (S3)
            const fileUrl = await uploadFile(data.file);

            // Create file record with data from Multer and request
            const file = new fileModel({
                userId: data.userId || 'anonymous',
                fileName: data.fileName || data.file.originalname,
                fileNameOriginal: data.fileNameOriginal || data.file.originalname,
                fileType: data.fileType || data.file.mimetype,
                fileSize: data.fileSize || data.file.size,
                fileUrl: fileUrl
            });
            
            return await file.save();
        } catch (error) {
            this.handleError(error, 'Không thể tải lên ảnh');
            throw error;
        }
    }

    /**
     * Upload PDF file
     */
    async uploadPdf(data: any): Promise<IFile> {
        try {
            // Upload file to storage (S3)
            const fileUrl = await uploadFile(data.file);

            // Create file record with data from Multer and request
            const file = new fileModel({
                userId: data.userId || 'anonymous',
                fileName: data.fileName || data.file.originalname,
                fileNameOriginal: data.fileNameOriginal || data.file.originalname,
                fileType: data.fileType || data.file.mimetype,
                fileSize: data.fileSize || data.file.size,
                fileUrl: fileUrl
            });
            
            return await file.save();
        } catch (error) {
            this.handleError(error, 'Không thể tải lên PDF');
            throw error;
        }
    }   

    /**
     * Upload video file
     */
    async uploadVideo(data: any): Promise<IFile> {
        try {
            // Upload file to storage (S3)
            const fileUrl = await uploadFile(data.file);

            // Create file record with data from Multer and request
            const file = new fileModel({
                userId: data.userId || 'anonymous',
                fileName: data.fileName || data.file.originalname,
                fileNameOriginal: data.fileNameOriginal || data.file.originalname,
                fileType: data.fileType || data.file.mimetype,
                fileSize: data.fileSize || data.file.size,
                fileUrl: fileUrl
            });
            
            return await file.save();
        } catch (error) {
            this.handleError(error, 'Không thể tải lên video');
            throw error;
        }
    }

    /**
     * Handle errors
     */
    private handleError(error: any, message: string): void {
        console.error(error);
        throw new FileServiceError(message);
    }
};

export default FileService;