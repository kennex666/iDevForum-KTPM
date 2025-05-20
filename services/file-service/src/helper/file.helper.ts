import { writeFile, mkdir } from "fs/promises";
import path from "path";

const randomFileName = (originalName: string) => {
    const extension = originalName.split('.').pop();
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
}

const uploadFile = async (file: any) => {
    const fileName = randomFileName(file.originalname);
    const uploadDir = path.resolve(__dirname, "../../uploads");
    const filePath = path.join(uploadDir, fileName);

    try {
        console.log('File info:', file);
        console.log('File buffer length:', file.buffer?.length);
        await mkdir(uploadDir, { recursive: true });
        await writeFile(filePath, file.buffer);
        console.log('File uploaded to local successfully:', filePath);
        return `http://localhost:3000/uploads/image/${fileName}`;
    } catch (error) {
        console.error('Error when writing file:', error);
        throw new Error('Upload file failed');
    }
}

export default uploadFile;
