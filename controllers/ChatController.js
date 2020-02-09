const {Group} = require('../models/group');
const {User} = require('../models/user');
const {Message} = require('../models/message');

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

    async createMessage(params){
        const newMessage = await Message.create({
            from: params.from,
            to: params.to,
            text: params.msg
        });
        return params.msg;
    }

}

module.exports = {
    ChatController
}