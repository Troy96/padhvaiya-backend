const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    actor: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    entityType: { type: String, enum: ['question', 'answer'], required: true },
    entityId: { type: mongoose.Types.ObjectId },
    operation: { type: String, enum: ['asked', 'answered'] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', NotificationSchema, 'Notification');

module.exports = {
    Notification
}