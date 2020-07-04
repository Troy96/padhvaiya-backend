const mongoose = require('mongoose');

const QuizQuestionSchema = new mongoose.Schema({
    quizId: { type: mongoose.Types.ObjectId, ref: 'Quiz' },
    engDesc: { type: String, default: null },
    hindiDesc: { type: String, default: null },
    engOptions: [{ type: String, default: null }],
    hindiOptions: [{ type: String, default: null }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    imgRef: { type: String, default: null },
    ans: { type: String, default: null }
});

const QuizQuestion = mongoose.model('QuizQuestion', QuizQuestionSchema, 'QuizQuestion');

module.exports = {
    QuizQuestion
}