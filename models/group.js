const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, default: null },
    groupCreator: { type: mongoose.Types.ObjectId, ref: 'User' },
    logoRef: { type: String, default: null },
    members: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    admins: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    followers: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    pendingRequests: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    college: { type: mongoose.Types.ObjectId, ref: 'College', unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})


GroupSchema.methods.storeNewMemberRequest = async function (userId) {
    let group = this;
    group['pendingRequests'].push(userId);
    return await group.save();
}


GroupSchema.methods.addNewMember = async function (userId) {
    let group = this;
    if (group['members'].includes(userId)) return;
    group['members'].push(userId);
    return await group.save();
}

GroupSchema.methods.addNewFollower = async function (userId) {
    let group = this;
    if (group['followers'].includes(userId)) return;
    group['followers'].push(userId);
    return await group.save();
}

GroupSchema.methods.isUserEligibleToPost = function (userId) {
    let group = this;
    if (!(group['admins'].includes(userId) || group['members'].includes(userId)))
        return false;
    return true;
}


const Group = mongoose.model('Group', GroupSchema, 'Group');


module.exports = { Group };