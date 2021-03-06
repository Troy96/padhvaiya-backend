const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    desc: { type: String, trim: true },
    questionId: { type: mongoose.Types.ObjectId, ref: 'Question' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    likes: { type: Number, default: 0 },
    imgRef: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Answer = mongoose.model('Answer', AnswerSchema, 'Answer');


module.exports = { Answer };