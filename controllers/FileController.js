const { User } = require('./../models/user');
const httpCodes = require('http-status');

class FileController {
    constructor() { }

    async changePicture(req, res) {
        try {
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId property not found!');
            if (!req.body.hasOwnProperty('imageType')) throw new Error('desc property not found!');
            if (!req.files) throw new Error('File not found!');
            const fileNameExt = req.files.file.name.split('.')[1];
            const storageName = req.body.imageType.concat(`_${req.body.userId}`).concat('.').concat(fileNameExt);
            req.files.file.mv(`public/images/profile/${storageName}`)
            const userObj = await User.findById({ _id: req.body.userId });
            switch (req.body.imageType) {
                case 'cover': {
                    userObj['coverImg'] = `images/profile/${storageName}`;
                    break;
                }
                case 'profile': {
                    userObj['profileImg'] = `images/profile/${storageName}`;
                    break;
                }
            }
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
