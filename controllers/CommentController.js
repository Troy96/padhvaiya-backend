const { Comment } = require('./../models/comment');
const { Post } = require('./../models/post');
const httpCodes = require('http-status');

class CommentController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('desc')) throw new Error('desc property not found!');
            if (!req.body.hasOwnProperty('postId')) throw new Error('postId property not found!');
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId property not found!');
            let dbObj;
            dbObj = {
                desc: req.body.desc,
                postId: req.body.postId,
                userId: req.body.userId
            };
            const newComment = new Comment(dbObj);
            const dbResp = await newComment.save();
            const postObj = await Post.findById({ _id: req.body.postId });
            if (!postObj) throw new Error('Post not found');
            postObj.comments.push(dbResp._id);
            await postObj.save();

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
            const commentList = await Comment.find()
            return res.status(httpCodes.OK).send(commentList)
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const commentId = req.params.id;
            const commentObj = await Comment.findOne({ _id: commentId })
            if (!commentObj) throw new Error('Question not found!');
            return res.status(httpCodes.OK).send(commentObj);
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
            const commentList = await Comment.find({ userId: userId })
                .populate('userId', 'first_name last_name');
            return res.status(httpCodes.OK).send(commentList);
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
            const commentId = req.params.id;
            await Comment.findByIdAndDelete({ _id: commentId });
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
            await Comment.deleteMany();
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

module.exports = { CommentController }