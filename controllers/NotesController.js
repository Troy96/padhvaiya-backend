const { Note } = require('../models/note');
const httpCodes = require('http-status');


class NotesController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId not found!');
            if (!req.body.hasOwnProperty('groupId')) throw new Error('groupId not found');
            if (!req.body.hasOwnProperty('desc')) throw new Error('Please give a description!');
            const { userId, groupId, desc } = req.body;
            const dbObj = { userId, groupId, desc };
            const dbResp = await new Note(dbObj).save();
            /* if (!!req.files) {
                const fileNameExt = req.files.file.name.split('.')[1];
                const storageName = dbResp._id.toString().concat('.').concat(fileNameExt);
                const cloudStoreKey = 'notes/' + storageName;
                const bufferData = req.files.file.data;
                const dbStorageRef = CONSTANTS.BASE_S3_REF + cloudStoreKey;
                await cloudController.uploadObject({ Bucket: process.env.BUCKET_NAME, Key: cloudStoreKey, Body: bufferData });
                const dbObj = await Answer.findById({ _id: dbResp._id });
                dbObj['imgRef'] = dbStorageRef;
                await dbObj.save();
            } */
            return res.status(httpCodes.OK).send({
                success: true
            })
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