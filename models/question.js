const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    desc: { type: String, trim: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    answers: [{ type: mongoose.Types.ObjectId, ref: 'Answer', default: [] }],
    imgRef: { type: String, default: null },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Question = mongoose.model('Question', QuestionSchema, 'Question');

module.exports = { Question }