const { Answer } = require('./../models/answer');
const { Post } = require('./../models/post');
const { User } = require('./../models/user');
const { Group } = require('./../models/group');
const httpCodes = require('http-status');
const { CONSTANTS } = require('../constants');
const {CloudController} = require('../controllers/CloudController');


class PostController {

    cloudController
    constructor() { 
         this.cloudController = new CloudController();
    }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('desc')) throw new Error('desc property not found!');
            if (!req.body.hasOwnProperty('user')) throw new Error('user property not found!');
            if (!req.body.hasOwnProperty('group')) throw new Error('group property not found!');

            const userId = req.body.user;
            const userObj = await User.findById({ _id: userId });
            if (!userObj) throw new Error('User not found');

            const groupObj = await Group.findById({ _id: req.body.group });
            if (!groupObj) throw new Error('Group not found');
            if (!groupObj.isUserEligible(userId)) {
                return res.status(httpCodes.FORBIDDEN).send({
                    error: 'User is not allowed to post!'
                });
            }

            let dbObj;
            dbObj = {
                desc: req.body.desc,
                user: req.body.user,
                group: req.body.group
            };

            const dbResp = await Post.create(dbObj);

            if (!!req.files) {
                const fileNameExt = req.files.file.name.split('.')[1];
                const storageName = dbResp._id.toString().concat('.').concat(fileNameExt);
                const cloudStoreKey = 'posts/' + storageName;
                const bufferData = req.files.file.data;
                const dbStorageRef = CONSTANTS.BASE_S3_REF + cloudStoreKey;
                await this.cloudController.uploadObject({ Bucket: process.env.BUCKET_NAME, Key: cloudStoreKey, Body: bufferData });
                const dbObj = await Post.findById({ _id: dbResp._id });
                dbObj['imgRef'] = dbStorageRef;
                await dbObj.save();
            }

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
            const postList = await Post.find()
                .populate('comments')
                .populate('user')
                .populate('group')
                .populate('sharedPostRef')
            return res.status(httpCodes.OK).send(postList)
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const postId = req.params.id;
            const postObj = await Post.findOne({ _id: postId })
                .populate('user', 'first_name last_name')
                .populate('comments')
                .populate('group')
            if (!postObj) throw new Error('Post not found!');
            return res.status(httpCodes.OK).send(postObj);
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
            const postList = await Post.find({ user: userId })
                .populate('user', 'first_name last_name')
                .populate('comments')
                .populate('group')
            return res.status(httpCodes.OK).send(postList);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getByGroup(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const groupId = req.params.id;
            const postList = await Post.find({ group: groupId })
                .populate('user', 'first_name last_name profileImg')
                .populate('comments')
                .populate('group')
            return res.status(httpCodes.OK).send(postList);
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
            const postId = req.params.id;
            await Post.findByIdAndDelete({ _id: postId });
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
            await Post.deleteMany();
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

    async actOnPost(req, res) {
        try {
            if (!req.body.hasOwnProperty('action')) throw new Error('Action not found!');
            const action = req.body.action;
            const count = action === 'Like' ? 1 : -1;
            await Post.updateOne({ _id: req.params.id }, { $inc: { likes: count } }, { new: true });
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

    async photosByGroup(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('GroupId not found');
            const groupId = req.params.id;
            const photosOfAllPostsList = (await Post.find({ group: groupId })
                .select({ imgRef: 1, _id: 0 }))
                .map(obj => obj['imgRef']);
            return res.status(httpCodes.OK).send(photosOfAllPostsList)
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            })
        }
    }

    async sharePost(req, res) {
        console.log(req.params)
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Post id not found');
            if (!req.body.hasOwnProperty('userId')) throw new Error('User Id not found');
            if (!req.body.hasOwnProperty('groupId')) throw new Error('Group Id not found');
            if (!req.body.hasOwnProperty('shareType')) throw new Error('shareType not found');
            if (!req.body.hasOwnProperty('desc')) throw new Error('desc not found');

            const postId = req.params.id;
            const userId = req.body.userId;
            const groupId = req.body.groupId;
            const desc = req.body.desc;

            const postObj = await Post.findById({ _id: postId });
            if (!postObj) throw new Error('Post not found');

            const userObj = await User.findById({ _id: userId });

            const groupObj = await Group.findById({ _id: groupId });
            if (!groupObj.isUserEligible(userId)) {
                return res.status(httpCodes.FORBIDDEN).send({
                    error: 'User is not allowed to share!'
                });
            }
            if (!groupObj) throw new Error('Group not found');

            if (!groupObj.isUserEligible(userId)) throw new Error('User is not eligible');

            if (!postObj.belongsToGroup(groupId)) throw new Error(`Post doesn't belong to group`);

            let dbObj = {};

            dbObj = {
                desc: desc,
                user: userId,
                group: groupId,
                sharedPostRef: postId
            }

            const postDbObj = await Post.create(dbObj);

            if (!!req.files) {
                const fileNameExt = req.files.file.name.split('.')[1];
                const storageName = dbResp._id.toString().concat('.').concat(fileNameExt);
                const cloudStoreKey = 'posts/' + storageName;
                const bufferData = req.files.file.data;
                const dbStorageRef = CONSTANTS.BASE_S3_REF + cloudStoreKey;
                await cloudController.uploadObject({ Bucket: process.env.BUCKET_NAME, Key: cloudStoreKey, Body: bufferData });
                const dbObj = await Post.findById({ _id: postDbObj._id });
                dbObj['imgRef'] = dbStorageRef;
                await dbObj.save();
            }
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

module.exports = { PostController }
