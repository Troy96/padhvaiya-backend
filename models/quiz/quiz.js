const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    name: { type: String, default: null },
    desc: { type: String, default: null },
    isOpenForRegistration: { type: Boolean, default: false },
    startDate: { type: String, default: null},
    startTime: { type: Number, default: null },
    endTime: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    totalQuestions: { type: Number, default: 0 }
});

const Quiz = mongoose.model('Quiz', QuizSchema, 'Quiz');

module.exports = {
    Quiz
}
