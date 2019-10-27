const { Answer } = require('./../models/answer');
const { Question } = require('./../models/question');
const httpCodes = require('http-status');

class AnswerController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('desc')) throw new Error('Answer desc property not found!');
            if (!req.body.hasOwnProperty('questionId')) throw new Error('questionId property not found!');
            const dbObj = {
                desc: desc,
                questionId: req.body.questionId
            };
            if (req.body.hasOwnProperty('userId')) dbObj['userId'] = req.body.userId;
            const newAnswer = new Answer(dbObj);
            const dbResp = await newAnswer.save();
            const questionObj = await Question.findById({ _id: questionId });
            if (!questionObj) throw new Error('Question not found');
            console.log(questionObj);
            if (!!req.files) {
                const fileNameExt = req.files.file.name.split('.')[1];
                const storageName = dbResp._id.toString().concat('.').concat(fileNameExt);
                req.files.file.mv(`public/images/answers/${storageName}`)

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
            const answerList = await Answer.find();
            return res.status(httpCodes.OK).send(answerList)
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const answerId = req.params.id;
            const answerObj = await Answer.findOne({ _id: answerId });
            if (!answerObj) throw new Error('Question not found!');
            return res.status(httpCodes.OK).send(answerObj);
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
            const answerId = req.params.id;
            await Answer.findByIdAndDelete({ _id: answerId });
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
            await Answer.deleteMany();
            return res.sendStatus(httpCodes.OK);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }
}

module.exports = { AnswerController }
