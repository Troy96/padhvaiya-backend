const { Note } = require('../models/note');
const httpCodes = require('http-status');
const { User } = require('../models/user');
const { Group } = require('../models/group');
const { CONSTANTS } = require('../constants');
const { CloudController } = require('../controllers/CloudController');

const cloudController = new CloudController();



class NotesController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId not found!');
            if (!req.body.hasOwnProperty('groupId')) throw new Error('groupId not found');
            if (!req.body.hasOwnProperty('desc')) throw new Error('Please give a description!');
            const { userId, groupId, desc } = req.body;

            const userObj = await User.findById({ _id: userId });
            if (!userObj) throw new Error('User not found');

            const groupObj = await Group.findById({ _id: groupId });
            if (!groupObj) throw new Error('Group not found');

            if (!groupObj.isUserEligible(userId)) throw new Error('User is not eligible');


            const dbObj = { userId, groupId, desc, fileRefs: [] };
            if (!req.files) throw new Error('Please upload some notes'); 
                if (req.files.file.length === undefined) {
                    const storageName = req.files.file['name'];
                    const cloudStoreKey = 'notes/' + storageName;
                    const bufferData = req.files.file['data'];
                    const dbStorageRef = CONSTANTS.BASE_S3_REF + cloudStoreKey;
                    dbObj.fileRefs.push(dbStorageRef);
                    await cloudController.uploadObject({ Bucket: process.env.BUCKET_NAME, Key: cloudStoreKey, Body: bufferData });
                    await Note.create(dbObj);
                    return res.status(httpCodes.OK).send({
                        success: true
                    })
                }
                else {
                    (async function next(i) {
                        if (i == req.files.file.length) {
                            await Note.create(dbObj);
                            return res.status(httpCodes.OK).send({
                                success: true
                            })
                        }
                        const storageName = req.files.file[i]['name'];
                        const cloudStoreKey = 'notes/' + storageName;
                        const bufferData = req.files.file[i]['data'];
                        const dbStorageRef = CONSTANTS.BASE_S3_REF + cloudStoreKey;
                        dbObj.fileRefs.push(dbStorageRef);
                        await cloudController.uploadObject({ Bucket: process.env.BUCKET_NAME, Key: cloudStoreKey, Body: bufferData });
                        return await next(++i);

                    }(0));
                }
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getAll(req, res) {
        try {
            const noteList = await Note.find({})
                .populate('userId')
                .populate('groupId');
            return res.status(httpCodes.OK).send(noteList);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Id not found');
            const noteId = req.params.id;
            const noteObj = await Note.findById({ _id: noteId });
            if (!noteObj) throw new Error('Note not found');
            return res.status(httpCodes.OK).send(noteObj);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            })
        }
    }

    async deleteAll(req, res) {
        try {
            await Note.deleteMany();
            return res.status(httpCodes.OK).send({
                success: true
            })
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            })
        }
    }

    async deleteById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Id not found');
            const noteId = req.params.id;
            await Note.deleteOne({ _id: noteId });
            return res.status(httpCodes.OK).send({
                sucess: true
            })
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            })
        }
    }




}

module.exports = { NotesController }