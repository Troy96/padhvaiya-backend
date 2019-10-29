const { Answer } = require('./../models/answer');
const { Question } = require('./../models/question');
const { User } = require('./../models/user');
const httpCodes = require('http-status');


class AnswerController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('desc')) throw new Error('Answer desc property not found!');
            if (!req.body.hasOwnProperty('questionId')) throw new Error('questionId property not found!');
            let dbObj;
            dbObj = {
                desc: req.body.desc,
                questionId: req.body.questionId
            };
            if (req.body.hasOwnProperty('userId')) dbObj['userId'] = req.body.userId;
            const newAnswer = new Answer(dbObj);
            const dbResp = await newAnswer.save();
            if (!!req.files) {
                const fileNameExt = req.files.file.name.split('.')[1];
                const storageName = dbResp._id.toString().concat('.').concat(fileNameExt);
                req.files.file.mv(`public/images/answers/${storageName}`);
                const dbObj = await Answer.findById({ _id: dbResp._id });
                dbObj['imgRef'] = `/images/answers/${storageName}`;
                await dbObj.save();
            }
            if (req.body.hasOwnProperty('userId')) {
                const userObj = await User.findById({ _id: req.body.userId });
                if (!userObj) throw new Error('User not found');
                userObj.answers.push(dbResp._id);
                await userObj.save();
            }
            const questionObj = await Question.findById({ _id: req.body.questionId });
            if (!questionObj) throw new Error('Question not found');
            questionObj.answers.push(dbResp._id);
            await questionObj.save();
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
            const answerList = await Answer.find()
                .populate('userId')
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
            const answerObj = await Answer.findOne({ _id: answerId })
                .populate('userId');
            if (!answerObj) throw new Error('Question not found!');
            return res.status(httpCodes.OK).send(answerObj);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getByQuestion(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const questionId = req.params.id;
            const answerList = await Answer.find({ questionId: questionId })
                .populate('userId', 'first_name last_name');
            return res.status(httpCodes.OK).send(answerList);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getByUser(req, res){
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const userId = req.params.id;
            const answerList = await Answer.find({ userId: userId })
                .populate('userId', 'first_name last_name');
            return res.status(httpCodes.OK).send(answerList);
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

    async deleteAll(req, res) {
        try {
            await Answer.deleteMany();
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

module.exports = { AnswerController }
