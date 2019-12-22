const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    postId: { type: mongoose.Types.ObjectId, ref: 'Post' },
    desc: { type: String, required: true, trim: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Comment = mongoose.model('Comment', CommentSchema, 'Comment');


module.exports = { Comment };