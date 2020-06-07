const { Question } = require('./../models/question');
const { User } = require('./../models/user');
const { Answer } = require('./../models/answer');
const { Notification } = require('./../models/notification');
const httpCodes = require('http-status');
const { CloudController } = require('./CloudController');
const { EmailController } = require('./EmailController');
const { CONSTANTS } = require('./../constants');

const cloudController = new CloudController();
const email = new EmailController();

class QuestionController {
    constructor() { }

    async create(req, res) {
        try {
            let desc = '';
            let options = [];
            let userObj = null;
            let questObj = null;
            let dbObj = {};

            if (!req.body.hasOwnProperty('type')) throw new Error('Type not found');

            dbObj['type'] = req.body.type;

            if (req.body.type == 'description') {
                if (req.body.hasOwnProperty('options')) throw new Error('Question type is description. Cannot have options!');
            }

            if (req.body.type == 'choice') {
                options = req.body.options;
                dbObj['options'] = [...options];
            }
            if (req.body.hasOwnProperty('userId')) dbObj['userId'] = req.body.userId;

            if (req.body.hasOwnProperty('desc')) dbObj['desc'] = req.body.desc;

            const newQuestion = new Question(dbObj);
            const dbResp = await newQuestion.save();

            questObj = await Question.findById({ _id: dbResp._id });


            if (!!req.files) {
                const fileNameExt = req.files.file.name.split('.')[1];
                const storageName = dbResp._id.toString().concat('.').concat(fileNameExt);
                const cloudStoreKey = 'questions/' + storageName;
                const bufferData = req.files.file.data;
                await cloudController.uploadObject({ Bucket: process.env.BUCKET_NAME, Key: cloudStoreKey, Body: bufferData });
                const dbStorageRef = CONSTANTS.BASE_S3_REF + cloudStoreKey;
                questObj['imgRef'] = dbStorageRef;
                await questObj.save();
            }
            if (req.body.hasOwnProperty('userId')) {
                userObj = await User.findById({ _id: req.body.userId });
                if (!userObj) throw new Error('User not found');
                userObj.questions.push(dbResp._id);
                await userObj.save();
            }

            await Notification.create({
                actor: req.body.userId,
                entityType: 'question',
                entityId: dbResp._id,
                operation: 'asked'
            });

            const users = await User.find({});

            // users.forEach(user => {

            //     let msg = `
            //     <p>Hey ${user.first_name}!,</p>
            //     <br/>
            //     <br/>
            //     <p>${userObj.first_name} ${userObj.last_name} asked a question recently. Do you think you can answer that?. Check it <a href="http://padhvaiya.com/question/${questObj._id}">here</a>!
            //     <br/>
            //     <br/>
            //     <p>Regards,</p>
            //     The Padhvaiya Team`;

            //     email.sendMail(user.email, 'A new question was posted!', msg)
            // });

            return res.status(httpCodes.OK).send({
                success: true,
                data: dbResp
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
                .populate('userId')
                .populate({ path: 'answers', populate: { path: 'userId' } })
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

    async reactionOnQuestion(req, res) {
        try {
            const ACTION_TYPE = ['Like', 'Unlike'];
            if (!req.params.hasOwnProperty('id')) throw new Error('Id not found');
            if (!req.body.hasOwnProperty('action')) throw new Error('Action not found');
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId not found');

            const { action } = req.body;
            const questionId = req.params.id;
            if (!ACTION_TYPE.includes(action)) throw new Error('Wrong action type');

            const count = action === 'Like' ? 1 : -1;

            switch (action) {
                case 'Like': {
                    count = 1;
                    if (!userFromUserLike) {
                        await UserLikeModel.create({
                            user: req.body.userId,
                            objectId: questionId,
                            objectType: 'question',
                            isLiked: true
                        })
                    }
                    else {
                        await UserLikeModel.update({
                            isLiked: true
                        })
                    }
                }
                case 'Unlike': {
                    count = -1;
                    if (!userFromUserLike) {
                        await UserLikeModel.create({
                            user: req.body.userId,
                            objectId: questionId,
                            objectType: 'question',
                            isLiked: false
                        })
                    }
                    else {
                        await UserLikeModel.update({
                            isLiked: false
                        })
                    }
                }
            }


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
