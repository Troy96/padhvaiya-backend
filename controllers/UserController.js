const { User } = require('./../models/user');
const { Question } = require('./../models/question');
const { Answer } = require('./../models/answer');
const httpCodes = require('http-status');

class UserController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('firstName')) throw new Error('firstName property not found!');
            if (!req.body.hasOwnProperty('lastName')) throw new Error('lastName property not found!');
            if (!req.body.hasOwnProperty('email')) throw new Error('email property not found!');
            if (!req.body.hasOwnProperty('password')) throw new Error('password property not found!');
            if (!req.body.hasOwnProperty('college')) throw new Error('college property not found!');

            let dbObj = {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                college: req.body.college
            };
            const newUser = new User(dbObj);
            await newUser.save();
            return res.status(httpCodes.OK).send({
                success: true
            });
        }
        catch (e) {
            let message = 'Something went wrong. Try again!';
            switch (e.code) {
                case 11000: {
                    message = 'Email address already registered';
                    break;
                }
            }
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: message
            });
        }
    }

    async getAll(req, res) {
        try {
            const userList = await User.find()
                .populate('questions')
                .populate('answers')
                .exec();
            return res.status(httpCodes.OK).send(userList)
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const userId = req.params.id;
            const userObj = await User.findOne({ _id: userId })
                .populate('questions')
                .populate('answers')
                .exec();
            if (!userObj) throw new Error('User not found!');
            return res.status(httpCodes.OK).send(userObj);
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
            const userId = req.params.id;
            await User.findByIdAndDelete({ _id: userId });
            let countOfQuestions = await Question.countDocuments({ userId: userId });
            if (countOfQuestions > 0) await Question.remove({ userId: userId });
            await User.findByIdAndDelete({ _id: userId });
            let countOfAnswers = await Answer.countDocuments({ userId: userId });
            if (countOfAnswers > 0) await Answer.remove({ userId: userId });
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
            await User.deleteMany();
            return res.sendStatus(httpCodes.OK);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async updateById(req, res) {
        try {
            let updateObj = {};
            if (!req.params.hasOwnProperty('id')) throw new Error('UserId not found');
            if (req.body.hasOwnProperty('first_name')) updateObj['first_name'] = req.body.first_name;
            if (req.body.hasOwnProperty('last_name')) updateObj['last_name'] = req.body.last_name;
            if (req.body.hasOwnProperty('email')) updateObj['email'] = req.body.email;
            if (req.body.hasOwnProperty('college')) updateObj['college'] = req.body.college;
            const userId = req.params.id;
            await User.findByIdAndUpdate({ _id: userId }, updateObj);
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

module.exports = { UserController }
