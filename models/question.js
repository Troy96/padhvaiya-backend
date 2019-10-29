const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    desc: { type: String, required: true, trim: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    answers: [{ type: mongoose.Types.ObjectId, ref: 'Answer', default: [] }],
    imgRef: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

const Question = mongoose.model('Question', QuestionSchema, 'Question');

module.exports = { Question }