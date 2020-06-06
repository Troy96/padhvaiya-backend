const mongoose = require('mongoose');

const QuizRuleSchema = new mongoose.Schema({
    quizId: { type: mongoose.Types.ObjectId, ref: 'Quiz' },
    desc: { type: String, default: null }
})

const QuizRule = mongoose.model('QuizRule', QuizRuleSchema, 'QuizRule');

module.exports = {
    QuizRule
}