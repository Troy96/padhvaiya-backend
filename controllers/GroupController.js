const { Group } = require('./../models/group');
const { User } = require('./../models/user');
const { College } = require('./../models/college');
const httpCodes = require('http-status');
const { CloudController } = require('./CloudController');
const { CONSTANTS } = require('../constants');

const cloudController = new CloudController();

class GroupController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('name')) throw new Error('name property not found!');
            if (!req.body.hasOwnProperty('desc')) throw new Error('desc property not found!');
            if (!req.body.hasOwnProperty('groupCreator')) throw new Error('groupCreator property not found!');
            if (!req.body.hasOwnProperty('college')) throw new Error('college property not found!');

            const collegeObj = await College.findById({ _id: req.body.college });
            if (!collegeObj) throw new Error('College not found');

            const groupCreatorObj = await User.findById({ _id: req.body.groupCreator });
            if (!groupCreatorObj) throw new Error('User not found');

            let dbObj = {};
            dbObj = {
                name: req.body.name,
                desc: req.body.desc,
                groupCreator: req.body.groupCreator,
                college: req.body.college,
                members: [req.body.groupCreator],
                admins: [req.body.groupCreator]
            };
            const newGroup = new Group(dbObj);
            const dbResp = await newGroup.save();
            if (!!req.files) {
                const fileNameExt = req.files.file.name.split('.')[1];
                const storageName = dbResp._id.toString().concat('.').concat(fileNameExt);
                const cloudStoreKey = 'groups/logo/' + storageName;
                const bufferData = req.files.file.data;
                await cloudController.uploadObject({ Bucket: process.env.BUCKET_NAME, Key: cloudStoreKey, Body: bufferData });
                const dbStorageRef = CONSTANTS.BASE_S3_REF + cloudStoreKey;
                const groupObj = await Group.findById({ _id: dbResp._id });
                groupObj['logoRef'] = dbStorageRef;
                await groupObj.save();
            }
            collegeObj['hasGroup'] = true;
            collegeObj['group'] = dbResp._id;
            await collegeObj.save();

            return res.status(httpCodes.OK).send({
                success: true
            })
        }
        catch (e) {
            let message = e.message;
            switch (e.code) {
                case 11000: {
                    message = 'Group for college already exists!';
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
            const groupList = await Group.find()
                .populate('groupCreator')
                .populate('college')
                .populate({
                    path: 'admins',
                    model: 'User'
                })
                .populate({
                    path: 'members',
                    model: 'User'
                })
            return res.status(httpCodes.OK).send(groupList)
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const groupId = req.params.id;
            const groupObj = await Group.findOne({ _id: groupId })
                .populate('groupCreator')
                .populate('college')
                .populate({
                    path: 'admins',
                    model: 'User'
                })
                .populate({
                    path: 'members',
                    model: 'User'
                })
            if (!groupObj) throw new Error('Group not found!');
            return res.status(httpCodes.OK).send(groupObj);
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
            const groupId = req.params.id;
            await Group.findByIdAndDelete({ _id: groupId });
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
            await Group.deleteMany();
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

    async requestMembership(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('groupId property not found');
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId property not found');
            const groupId = req.params.id;
            const userId = req.body.userId;
            const userObj = await User.findById({ _id: userId });
            const groupObj = await Group.findById({ _id: groupId });
            if (!groupObj) throw new Error('Group not found!');
            if (!userObj) throw new Error('User not found!');
            await groupObj.storeNewMemberRequest(userId);
            return res.status(httpCodes.OK).send({success: true});
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            })
        }
    }

    async getPendingMembersByGroup(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('groupId not found');
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId not found');
            const groupId = req.params.id;
            const userId = req.body.userId;
            const groupObj = await Group.findById({ _id: groupId })
                .populate('pendingRequests')
            if (!groupObj) throw new Error('Group not found!');
            if (!groupObj.admins.includes(userId)) throw new Error('User is not admin');
            return res.status(httpCodes.OK).send(groupObj.pendingRequests);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            })
        }
    }

    async takeMembershipAction(req, res) {
        try {
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId not found!');
            if (!req.params.hasOwnProperty('id')) throw new Error('groupId not found!');
            if (!req.body.hasOwnProperty('actionType')) throw new Error('actionType not found!');
            const userId = req.body.userId;
            const groupId = req.params.id;
            const actionType = req.body.actionType;
            const groupObj = await Group.findById({ _id: groupId });
            if (!groupObj) throw new Error('Group not found!');
            const userObj = await User.findById({ _id: userId });
            if (!userObj) throw new Error('User not found!');
            switch (actionType) {
                case 'allowMembership': {
                    groupObj.addNewMember(userId);
                    break;
                }
                case 'allowFollowing': {
                    groupObj.addNewFollower(userId);
                    break;
                }
                default: {
                    throw new Error('Wrong actionType');
                }
            }
            //groupObj.pendingRequests.splice(groupObj.pendingRequests.indexOf(userId));
            return res.status(httpCodes.OK).send(groupObj)

        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR)
                .send({
                    error: e.message
                })
        }
    }
}

module.exports = { GroupController }
