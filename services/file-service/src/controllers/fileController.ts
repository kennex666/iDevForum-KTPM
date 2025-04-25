import { Request, Response } from 'express';
import FileService from '../services/fileService';
import { IFile } from '../models/fileModel';

/**
 * File controller
 */
interface IFileController {
    uploadImage(data: any): Promise<IFile>;
}

class FileControllerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FileControllerError';
    }
}

class FileController implements IFileController {
    private fileService: FileService;

    constructor() {
        this.fileService = new FileService();
    }

    async uploadImage(data: any): Promise<IFile> {
        try {
            return await this.fileService.uploadImage(data);
        } catch (error) {
            this.handleError(error, 'Lỗi khi tải lên ảnh');
            throw error;
        }
    }
    
    private handleError(error: any, message: string): void {
        console.error(error);
        throw new FileControllerError(message);
    }
}

export default FileController;