import express from "express";
import { Request, Response } from "express";
import FileController from "../controllers/fileController";

const router = express.Router();

const fileController = new FileController();

interface ApiResponse<T> {
    errorCode: number;
    errorMessage: string;
    data: T | null;
}

const uploadSuccessResponse = <T>(data: T, message: string): ApiResponse<T> => ({
    errorCode: 200,
    errorMessage: message,
    data,
});

const uploadErrorResponse = (message: string, code: number = 400): ApiResponse<null> => ({
    errorCode: code,
    errorMessage: message,
    data: null,
});

router.post('/image', (req: Request, res: Response) => {
    const data = req.body;
    fileController.uploadImage(data)
        .then(() => {
            res.status(200).json(uploadSuccessResponse(null, 'Upload image success'));
        })
        .catch((error) => {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json(uploadErrorResponse(message));
        });
});

router.post('/video', (req: Request, res: Response) => {
    const data = req.body;
    fileController.uploadVideo(data)
        .then(() => {
            res.status(200).json(uploadSuccessResponse(null, 'Upload video success'));
        })
        .catch((error) => {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json(uploadErrorResponse(message));
        });
});

router.post('/pdf', (req: Request, res: Response) => {
    const data = req.body;
    fileController.uploadPdf(data)
        .then(() => {
            res.status(200).json(uploadSuccessResponse(null, 'Upload PDF success'));
        })
        .catch((error) => {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json(uploadErrorResponse(message));
        });
});
export default router;