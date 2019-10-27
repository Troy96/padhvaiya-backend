const { Question } = require('./../models/question');
const httpCodes = require('http-status');

class QuestionController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('desc')) throw new Error('Question desc property not found!');
            const desc = req.body.desc;
            if (!desc) throw new Error('Question desc not found!');
            const dbObj = {desc: desc};
            if(req.body.hasOwnProperty('userId')) dbObj['userId'] = req.body.userId;
            const newQuestion = new Question(dbObj);
            const dbResp = await newQuestion.save();
            if (!!req.files) {
                const fileNameExt = req.files.file.name.split('.')[1];
                const storageName = dbResp._id.toString().concat('.').concat(fileNameExt);
                req.files.file.mv(`public/images/${storageName}`)

            }
            return res.sendStatus(httpCodes.OK)
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getAll(req, res) {
        try {
            const questionList = await Question.find();
            return res.status(httpCodes.OK).send(questionList)
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const questionId = req.params.id;
            const questionObj = await Question.findOne({ _id: questionId });
            if (!questionObj) throw new Error('Question not found!');
            return res.status(httpCodes.OK).send(questionObj);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async deleteById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const questionId = req.params.id;
            await Question.findByIdAndDelete({ _id: questionId });
            return res.sendStatus(httpCodes.OK)
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async deleteAll(req, res) {
        try {
            await Question.deleteMany();
            return res.sendStatus(httpCodes.OK);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }
}

module.exports = { QuestionController }
