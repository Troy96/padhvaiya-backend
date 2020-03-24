const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    from: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    to: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    text: { type: String, default: null },
    roomId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})


const Message = mongoose.model('Message', MessageSchema, 'Message');

module.exports = {
    Message
}