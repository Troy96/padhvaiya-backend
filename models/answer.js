const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    desc: { type: String, required: true, trim: true },
    questionId: { type: mongoose.Types.ObjectId, ref: 'Question' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

const Answer = mongoose.model('Answer', AnswerSchema, 'Answer');


module.exports = { Answer };