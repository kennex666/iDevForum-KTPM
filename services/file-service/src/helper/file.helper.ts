import { cp } from "fs";
import { S3, AWS_BUCKET_NAME } from "../config/aws";
import { console } from "inspector";

const randomFileName = (originalName: string) => {
    const extension = originalName.split('.').pop();
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
}

const uploadFile = async (file: any) => {
    const fileName = randomFileName(file.originalname);

    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
    }
    try {
        const result = await S3.putObject(params).promise();
        console.log('File uploaded successfully', result);
        return  `https://${AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        throw new Error('Upload file failed');
    }
}

export default uploadFile;
