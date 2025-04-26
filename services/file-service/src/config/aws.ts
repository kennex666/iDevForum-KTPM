const AWS = require('aws-sdk');

const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

AWS.config = config;
const S3 = new AWS.S3();
const AWS_BUCKET_NAME = process.env.BUCKET_NAME || 'your-default-bucket-name';

export {
    S3,
    AWS_BUCKET_NAME,
}
