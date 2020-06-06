const mongoose = require('mongoose');
const validator = require('validator');

const QuizParticipantSchema = new mongoose.Schema({
    quizId: { type: mongoose.Types.ObjectId, ref: 'Quiz' },
    name: { type: String, default: null },
    email: { type: String, unique: true, validate: { validator: validator.isEmail, message: 'Not a valid Email' } },
    phone: { type: Number, default: null, unique: true },
    age: { type: Number, default: null },
    isRegistered: { type: Boolean, default: true },
    isQualified: { type: Boolean, default: true }
});

const QuizParticipant = mongoose.model('QuizParticipant', QuizParticipantSchema, 'QuizParticipant');

module.exports = {
    QuizParticipant
}