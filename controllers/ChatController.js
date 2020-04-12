const { Group } = require('../models/group');
const { User } = require('../models/user');
const { Message } = require('../models/message');
const httpCodes = require('http-status');

class ChatController {
    constructor() { }

    async handlerUserIsOnline(userId) {
        // const userObj = await User.findById({ _id: userId });
        // userObj['lastSeen'] = 'online';
        // await userObj.save();
    }

    async handlerUserIsOffline(userId) {
        const userObj = await User.findById({ _id: userId });
        userObj['lastSeen'] = new Date().toLocaleString();
        await userObj.save();
    }

    async createMessage(params) {
        return params.msg;
    }

    async getChatHistory(req, res) {
        if (!req.body.hasOwnProperty('roomId')) throw new Error('roomId not found');

        const roomId = req.body.roomId;

        try {
            const messageList = await Message.find({
                roomId: roomId
            })
            .populate('from','profileImg');
            return res.status(httpCodes.OK).send(messageList);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            })
        }
    }

}

module.exports = {
    ChatController
}