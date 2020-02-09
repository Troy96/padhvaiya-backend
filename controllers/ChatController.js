const {Group} = require('../models/group');
const {User} = require('../models/user');

class ChatController {
    constructor() { }

    async handlerUserIsOnline(userId) {
        const userObj = await User.findById({ _id: userId });
        userObj['lastSeen'] = 'online';
        await userObj.save();
    }

    async handlerUserIsOffline(userId) {
        const userObj = await User.findById({ _id: userId });
        userObj['lastSeen'] = new Date().toLocaleString();
        await userObj.save();
    }
}

module.exports = {
    ChatController
}