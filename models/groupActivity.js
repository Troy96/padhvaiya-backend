const mongoose = require('mongoose');

const groupActivitySchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    activityType: { type: String, enum: ['created', 'joined', 'deleted'], required: true },
    activitySubject: { type: String, enum: ['group', 'post', 'note'], required: true },
    activitySubjectRef: { type: mongoose.Types.ObjectId, default: null }
});

const groupActivityModel = mongoose.Model('GroupActivity', groupActivitySchema, 'GroupActivity');

module.exports = { groupActivityModel };