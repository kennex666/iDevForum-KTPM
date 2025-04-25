const AWS = require('aws-sdk');

const config = new AWS.Config({
    accessKeyId: 'AKIAQ4J5XZP7XXUMXZOJ',
    secretAccessKey: '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',
    region: 'ap-southeast-2',
});

AWS.config = config;
const S3 = new AWS.S3();
const AWS_BUCKET_NAME = 'bucketiamdefault';

export {
    S3,
    AWS_BUCKET_NAME,
}
