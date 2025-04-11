import express from "express";
import multer from "multer";
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

// Configure storage
const storage = multer.memoryStorage();

// Configure file filters
const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const pdfFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'));
    }
};

const videoFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed'));
    }
};

// Create upload instances with different configurations
const uploadImage = multer({ 
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

const uploadPdf = multer({ 
    storage,
    fileFilter: pdfFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});

const uploadVideo = multer({ 
    storage,
    fileFilter: videoFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB
    },
});

// Image upload route
router.post('/image', uploadImage.single('file'), (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
        res.status(400).json(uploadErrorResponse('No file uploaded'));
        return;
    }
    
    // Prepare data object with file and additional fields from request body
    const data = {
        file,
        userId: req.body.userId,
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
            res.status(400).json(uploadErrorResponse(message));
        });
});

// Video upload route
router.post('/video', uploadVideo.single('file'), (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
        res.status(400).json(uploadErrorResponse('No file uploaded'));
        return;
    }
    
    // Prepare data object with file and additional fields from request body
    const data = {
        file,
        userId: req.body.userId,
        fileName: file.originalname,
        fileNameOriginal: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size
    };
    
    fileController.uploadVideo(data)
        .then((result) => {
            res.status(200).json(uploadSuccessResponse(result, 'Upload video success'));
        })
        .catch((error) => {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json(uploadErrorResponse(message));
        });
});

// PDF upload route
router.post('/pdf', uploadPdf.single('file'), (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
        res.status(400).json(uploadErrorResponse('No file uploaded'));
        return;
    }
    
    // Prepare data object with file and additional fields from request body
    const data = {
        file,
        userId: req.body.userId,
        fileName: file.originalname,
        fileNameOriginal: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size
    };
    
    fileController.uploadPdf(data)
        .then((result) => {
            res.status(200).json(uploadSuccessResponse(result, 'Upload PDF success'));
        })
        .catch((error) => {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json(uploadErrorResponse(message));
        });
});

export default router;