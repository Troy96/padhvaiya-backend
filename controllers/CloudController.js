const AWS = require('aws-sdk');
const uuid = require('uuid');

class CloudController {
    constructor() {
    }

    /**
     * Creates a new Bucket on S3
     * @param {String} bucketName 
     */
    async createBucket(bucketName) {
        return new AWS.S3({ apiVersion: '2006-03-01' })
            .createBucket({ Bucket: `${bucketName} +${uuid.v4()}` })
            .promise();
    }

    async uploadObject({ Bucket = bucketName, Key = keyName, Body = objectBody, ACL = 'public-read' }) {
        return new AWS.S3({ apiVersion: '2006-03-01' })
            .putObject({ Bucket, Key, Body, ACL })
            .promise();
    }
}

module.exports = {
    CloudController
}