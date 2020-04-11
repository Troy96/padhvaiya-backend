const mongoose = require('mongoose');

const UserLikeSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, required: true },
    objectId: { type: mongoose.Types.ObjectId, required: true },
    isLiked: { type: Boolean, default: false },
    objectType: { type: String, enum: ['post', 'answer', 'question'] }
});

const UserLikeModel = mongoose.model('UserLike', UserLikeSchema, 'UserLike');

module.exports = {
    UserLikeModel
}