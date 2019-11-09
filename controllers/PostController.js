const { Answer } = require('./../models/answer');
const { Post } = require('./../models/post');
const httpCodes = require('http-status');

class PostController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('desc')) throw new Error('desc property not found!');
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId property not found!');
            let dbObj;
            dbObj = {
                desc: req.body.desc,
                userId: req.body.questionId
            };
            const newPost = new Post(dbObj);
            await newPost.save();

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
            const postObj = await Answer.findOne({ _id: postId })
            if (!postObj) throw new Error('Question not found!');
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
            const postList = await Post.find({ userId: userId })
                .populate('userId', 'first_name last_name');
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
}

module.exports = { PostController }
