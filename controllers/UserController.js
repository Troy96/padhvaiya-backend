const { User } = require('./../models/user');
const { Question } = require('./../models/question');
const { Answer } = require('./../models/answer');
const { UserLikeModel } = require('./../models/user-like');
const { Group } = require('./../models/group');
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
                .populate('college')
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
            let userObj = await User.findOne({ _id: userId })
                .populate('questions')
                .populate('answers')
                .exec();
            if (!userObj) throw new Error('User not found!');

            console.log(userObj)

            const creatorGroup = await Group.find({ admins: { $all: [userId] } });
            const membershipGroups = await Group.find({ members: { $all: [userId] } });
            const followingGroups = await Group.find({ followers: { $all: [userId] } });

            const allGroups = [...creatorGroup, ...membershipGroups, ...followingGroups];

            let respObj = {
                user: userObj,
                groups: allGroups
            };
            return res.status(httpCodes.OK).send(respObj);
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
            await User.deleteOne({ _id: userId });
            await Question.deleteMany({ userId: userId });
            await Answer.deleteMany({ userId: userId });
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
            await Question.deleteMany();
            await Answer.deleteMany();
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

    async getUserLikeStateByObjectType(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('userId not found');
            if (!req.params.hasOwnProperty('objectType')) throw new Error('objectType not found');

            const userLikeStateList = await UserLikeModel
                .find({ user: req.params.id, objectType: req.params.objectType });

            return res.status(httpCodes.OK).send({
                success: true,
                data: userLikeStateList
            });

        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                error: e.message
            })
        }
    }


}

module.exports = { UserController }
