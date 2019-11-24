const { User } = require('./../models/user');
const httpCodes = require('http-status');
const { CloudController } = require('../controllers/CloudController');
const { CONSTANTS } = require('./../constants');

const cloudController = new CloudController();

class FileController {
    constructor() { }

    async changePicture(req, res) {
        try {
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId property not found!');
            if (!req.body.hasOwnProperty('imageType')) throw new Error('desc property not found!');
            if (!req.files) throw new Error('File not found!');
            const fileNameExt = req.files.file.name.split('.')[1];
            const storageName = req.body.imageType.concat(`_${req.body.userId}`).concat('.').concat(fileNameExt);
            let cloudStoreKey = '';
            const bufferData = req.files.file.data;
            const userObj = await User.findById({ _id: req.body.userId });
            switch (req.body.imageType) {
                case 'cover': {
                    cloudStoreKey = 'profiles/' + storageName;
                    userObj['coverImg'] = CONSTANTS.BASE_S3_REF + cloudStoreKey;
                    break;
                }
                case 'profile': {
                    cloudStoreKey = 'profiles/' + storageName;
                    userObj['profileImg'] = CONSTANTS.BASE_S3_REF + cloudStoreKey;
                    break;
                }
            }
            await cloudController.uploadObject({ Bucket: process.env.BUCKET_NAME, Key: cloudStoreKey, Body: bufferData });
            await userObj.save();
            return res.status(httpCodes.OK).send({
                success: true
            });
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }
}

module.exports = { FileController }
