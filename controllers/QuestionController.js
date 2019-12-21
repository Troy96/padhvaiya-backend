const { Question } = require('./../models/question');
const { User } = require('./../models/user');
const { Answer } = require('./../models/answer');
const httpCodes = require('http-status');
const { CloudController } = require('./CloudController');
const { CONSTANTS } = require('./../constants');

const cloudController = new CloudController();

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
                const cloudStoreKey = 'questions/' + storageName;
                const bufferData = req.files.file.data;
                await cloudController.uploadObject({ Bucket: process.env.BUCKET_NAME, Key: cloudStoreKey, Body: bufferData });
                const dbStorageRef = CONSTANTS.BASE_S3_REF + cloudStoreKey;
                const questObj = await Question.findById({ _id: dbResp._id });
                questObj['imgRef'] = dbStorageRef;
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
                .populate('userId', 'first_name last_name profileImg')
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

    async getByUser(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const userId = req.params.id;
            const questionList = await Question.find({ userId: userId })
                .populate('userId', 'first_name last_name')
                .exec();
            return res.status(httpCodes.OK).send(questionList);
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

    async questionAction(req, res) {
        try {
            const ACTION_TYPE = ['Like', 'Unlike'];
            if (!req.params.hasOwnProperty('id')) throw new Error('Id not found');
            if (!req.body.hasOwnProperty('action')) throw new Error('Action not found');
            const { action } = req.body;
            const questionId = req.params.id;
            if (!ACTION_TYPE.includes(action)) throw new Error('Wrong action type');
            const count = action === 'Like' ? 1 : -1;
            await Question.updateOne({ _id: questionId }, { $inc: { likes: count } }, { new: true });
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
}

module.exports = { QuestionController }
