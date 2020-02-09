const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    from: { type: mongoose.Types.ObjectId, required: true },
    to: { type: mongoose.Types.ObjectId, required: true },
    text: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})


const Message = mongoose.model('Message', MessageSchema, 'Message');

module.exports = {
    Message
}