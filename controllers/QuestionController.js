const { Question } = require('./../models/question');
const { User } = require('./../models/user');
const { Answer } = require('./../models/answer');
const httpCodes = require('http-status');
const os = require('os');

class QuestionController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('desc')) throw new Error('desc property not found!');
            const desc = req.body.desc;
            if (!desc) throw new Error('Question desc not found!');
            let dbObj = { desc: desc };
            if (req.body.hasOwnProperty('userId')) dbObj['userId'] = req.body.userId;
            const newQuestion = new Question(dbObj);
            const dbResp = await newQuestion.save();
            if (!!req.files) {
                const fileNameExt = req.files.file.name.split('.')[1];
                const storageName = dbResp._id.toString().concat('.').concat(fileNameExt);
                req.files.file.mv(`public/images/questions/${storageName}`)
                const questObj = await Question.findById({ _id: dbResp._id });
                questObj['imgRef'] = `images/questions/${storageName}`;
                await questObj.save();
            }
            if (req.body.hasOwnProperty('userId')) {
                const userObj = await User.findById({ _id: req.body.userId });
                if (!userObj) throw new Error('User not found');
                userObj.questions.push(dbResp._id);
                await userObj.save();
            }
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

    async getAll(req, res) {
        try {
            const questionList = await Question.find()
                .populate('userId', 'first_name last_name')
                .populate('answers')
                .exec();
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
            const questionObj = await Question.findOne({ _id: questionId })
                .populate('userId', 'first_name last_name')
                .exec();
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
            const countOfAnswers = await Answer.countDocuments();
            if (countOfAnswers > 0) await Answer.remove({ questionId: questionId })
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
            await Question.deleteMany();
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

module.exports = { QuestionController }
