const AWS = require('aws-sdk');

const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'ap-southeast-2',
});

AWS.config = config;
const S3 = new AWS.S3();
const AWS_BUCKET_NAME = 'bucketiamdefault';

export {
    S3,
    AWS_BUCKET_NAME,
}
