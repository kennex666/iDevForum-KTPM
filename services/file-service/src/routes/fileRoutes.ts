import express from "express";
import multer from "multer";
import { Request, Response } from "express";
import FileController from "../controllers/fileController";
import { authenticate } from "../utils/authenticate";

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

const storage = multer.memoryStorage();

const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const uploadImage = multer({ 
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

router.post('/image', uploadImage.single('file'), authenticate, (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
        res.status(200).json(uploadErrorResponse('No file uploaded'));
        return;
    }
    const userId = req.user?._id;
    const data = {
        file,
        userId: userId,
        fileName: file.originalname,
        fileNameOriginal: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size
    };
    
    fileController.uploadImage(data)
        .then((result) => {
            res.status(200).json(uploadSuccessResponse(result, 'Upload image success'));
        })
        .catch((error) => {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(200).json(uploadErrorResponse(message));
    });
});


export default router;