const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    desc: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment', default: [] }],
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    imgRef: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

const Post = mongoose.model('Post', PostSchema, 'Post');


module.exports = { Post };