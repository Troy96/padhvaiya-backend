const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    collegeId:{ type: mongoose.Types.ObjectId, ref:'College'},
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    fileRef: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

const Answer = mongoose.model('Answer', AnswerSchema, 'Answer');


module.exports = { Answer };