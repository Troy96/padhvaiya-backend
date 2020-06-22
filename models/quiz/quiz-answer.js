const mongoose = require('mongoose');

const QuizAnswerSchema = new mongoose.Schema({

    quizId: { type: mongoose.Types.ObjectId, ref: 'Quiz' },
    questionId: { type: mongoose.Types.ObjectId, ref: 'QuizQuestion' },
    participantId: { type: mongoose.Types.ObjectId, ref: 'QuizParticipant' },
    answerGiven: { type: String, default: null }

});

const QuizAnswer = mongoose.model('QuizAnswer', QuizAnswerSchema, 'QuizAnswer');

module.exports = {
    QuizAnswer
}