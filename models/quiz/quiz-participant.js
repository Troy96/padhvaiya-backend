const mongoose = require('mongoose');
const validator = require('validator');

const QuizParticipantSchema = new mongoose.Schema({
    quizId: { type: mongoose.Types.ObjectId, ref: 'Quiz' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    name: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: Number, default: null },
    age: { type: Number, default: null },
    attemptedQuestions: { type: Number, default: 0 },
    isRegistered: { type: Boolean, default: true },
    isQualified: { type: Boolean, default: true },
    canAnswer: { type: Boolean, default: true },
    correctAnswers: { type: Number, default: 0 }
});

const QuizParticipant = mongoose.model('QuizParticipant', QuizParticipantSchema, 'QuizParticipant');

module.exports = {
    QuizParticipant
}