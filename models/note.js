const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    groupId:{ type: mongoose.Types.ObjectId, ref:'Group'},
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    fileRefs: [{ type: String, default: null }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Note = mongoose.model('Note', NoteSchema, 'Note');


module.exports = { Note};