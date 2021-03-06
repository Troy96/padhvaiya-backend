const { Answer } = require('./../models/answer');
const { Question } = require('./../models/question');
const { User } = require('./../models/user');
const httpCodes = require('http-status');
const { CloudController } = require('./CloudController');
const { UserLikeModel } = require('../models/user-like');
const { Notification } = require('./../models/notification');
const { EmailController } = require('./../controllers/EmailController');
const { CONSTANTS } = require('./../constants');
const cloudController = new CloudController();
const email = new EmailController();

class AnswerController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('questionId')) throw new Error('questionId property not found!');
            let dbObj = {};
            let userObj = {};
            let questionObj = {};
            if (req.body.desc) dbObj['desc'] = req.body.desc;
            dbObj['questionId'] = req.body.questionId;
            if (req.body.hasOwnProperty('userId')) dbObj['userId'] = req.body.userId;
            const newAnswer = new Answer(dbObj);
            const dbResp = await newAnswer.save();

            if (!!req.files) {
                const fileNameExt = req.files.file.name.split('.')[1];
                const storageName = dbResp._id.toString().concat('.').concat(fileNameExt);
                const cloudStoreKey = 'answers/' + storageName;
                const bufferData = req.files.file.data;
                const dbStorageRef = CONSTANTS.BASE_S3_REF + cloudStoreKey;
                await cloudController.uploadObject({ Bucket: process.env.BUCKET_NAME, Key: cloudStoreKey, Body: bufferData });
                const dbObj = await Answer.findById({ _id: dbResp._id });
                dbObj['imgRef'] = dbStorageRef;
                await dbObj.save();
            }
            if (req.body.hasOwnProperty('userId')) {
                userObj = await User.findById({ _id: req.body.userId });
                if (!userObj) throw new Error('User not found');
                userObj.answers.push(dbResp._id);
                await userObj.save();
            }
            questionObj = await Question.findById({ _id: req.body.questionId });
            if (!questionObj) throw new Error('Question not found');
            questionObj.answers.push(dbResp._id);
            await questionObj.save();

            await Notification.create({
                actor: req.body.userId,
                entityType: 'question',
                entityId: questionObj._id,
                operation: 'answered'
            });

            // const users = await User.find({});

            // users.forEach(user => {

            //     let msg = `
            //     <p>Hey ${user.first_name}!,</p>
            //     <br/>
            //     <br/>
            //     <p>${userObj.first_name} ${userObj.last_name} answered a question recently. Do you want to add more?. Check it <a href="http://padhvaiya.com/question/${questionObj._id}">here</a>!
            //     <br/>
            //     <br/>
            //     <p>Regards,</p>
            //     The Padhvaiya Team`;

            //     email.sendMail(user.email, 'A new answer was posted!', msg)
            // });

            return res.status(httpCodes.OK).send({
                success: true,
                data: dbResp
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

    async getByUser(req, res) {
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

    async reactionOnAnswer(req, res) {
        try {
            const actionType = ['Like', 'Unlike'];
            if (!req.body.hasOwnProperty('action')) throw new Error('Action not found');
            if (!req.params.hasOwnProperty('id')) throw new Error('Id not found');
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId not found');
            const answerId = req.params.id;


            const userFromUserLike = await UserLikeModel.findOne({ user: req.body.userId, objectId: answerId, objectType: 'answer' });

            const { action } = req.body;
            if (!actionType.includes(action)) throw new Error('Wrong action type');

            let count = null;

            switch (action) {
                case 'Like': {
                    count = 1;
                    if (!userFromUserLike) {
                        await UserLikeModel.create({
                            user: req.body.userId,
                            objectId: answerId,
                            objectType: 'answer',
                            isLiked: true
                        })
                    }
                    else {
                        await UserLikeModel.updateOne(
                            {
                                user: req.body.userId,
                                objectId: answerId,
                                objectType: 'answer'
                            }, { $set: { isLiked: true } }, { new: true })
                    }
                    break;
                }
                case 'Unlike': {
                    count = -1;
                    if (!userFromUserLike) {
                        await UserLikeModel.create({
                            user: req.body.userId,
                            objectId: answerId,
                            objectType: 'answer',
                            isLiked: false
                        })
                    }
                    else {
                        await UserLikeModel.updateOne(
                            {
                                user: req.body.userId,
                                objectId: answerId,
                                objectType: 'answer'
                            }, { $set: { isLiked: false } }, { new: true })
                    }
                    break;
                }
            }
            await Answer.updateOne({ _id: answerId }, { $inc: { likes: count } }, { new: true });
            return res.status(httpCodes.OK).send({
                success: true
            })
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            })
        }
    }
}

module.exports = { AnswerController }
