import { Request, Response } from 'express';
import FileService from '../services/fileService';

/**
 * File controller
 */
interface IFileController {
    uploadImage(req: Request, res: Response): Promise<void>;
    uploadVideo(req: Request, res: Response): Promise<void>;
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

    async getFileById(id: string): Promise<void> {
        try {
            const file = await this.fileService.getFileById(id);
        } catch (error) {
            this.handleError(error, 'Lỗi khi lấy file');
        }
    }

    async uploadImage(data: any): Promise<void> {
        try {
            const file = await this.fileService.uploadImage(data);
            } catch (error) {
                this.handleError(error, 'Lỗi khi tải lên ảnh');
        }
    }

    async uploadVideo(data: any): Promise<void> {
        try {
            const file = await this.fileService.uploadVideo(data);
        } catch (error) {
            this.handleError(error, 'Lỗi khi tải lên video');
        }
    }

    async uploadPdf(data: any): Promise<void> {
        try {
            const file = await this.fileService.uploadPdf(data);
        } catch (error) {
            this.handleError(error, 'Lỗi khi tải lên PDF');
        }
    }
    
    private handleError(error: any, message: string): void {
        console.error(error);
        throw new FileControllerError(message);
    }
}

export default FileController;