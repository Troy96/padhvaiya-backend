const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    desc: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment', default: [] }],
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Types.ObjectId, ref: 'Group' },
    imgRef: { type: String, default: null },
    sharedPostRef: { type: mongoose.Types.ObjectId, ref: 'Post', default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})


PostSchema.methods.belongsToGroup = function(groupId){
    let post = this;
    if(post['group'].toString() !== groupId) return false;
    return true;
}


const Post = mongoose.model('Post', PostSchema, 'Post');


module.exports = { Post };