const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, default: null },
    groupCreator: { type: mongoose.Types.ObjectId, ref: 'User' },
    logoRef: { type: String, default: null },
    admins: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    members: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    college: { type: mongoose.Types.ObjectId, ref: 'College', unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

const Group = mongoose.model('Group', GroupSchema, 'Group');


module.exports = { Group };