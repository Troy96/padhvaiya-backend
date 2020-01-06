module.exports.CONSTANTS = {
    BASE_S3_REF: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/`,
    EMAIL_CONFIG: {
        SERVICE: 'gmail',
        USER_EMAIL: process.env.USER_EMAIL,
        USER_PASSWORD: process.env.USER_PASSWORD
    }
}