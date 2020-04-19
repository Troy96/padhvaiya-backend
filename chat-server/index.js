
const { Group } = require('../models/group');
const { User } = require('../models/user');
const { Message } = require('../models/message');
const { Room } = require('../models/rooms');
const { ChatController } = require('../controllers/ChatController');

const chatController = new ChatController();

const { rooms } = require('../singleton');


module.exports = function (io) {

    io.on('connection', client => {
        client.on('userIsOnline', chatController.handlerUserIsOnline);

        client.on('userIsOffline', chatController.handlerUserIsOffline);

        client.on('getGroupMembers', async groupId => {
            const groupObj = await Group.findById({ _id: groupId })
                .populate('admins')
                .populate('members');
            const memberList = groupObj['admins'].concat(groupObj['members']);
            client.emit('onGroupMembers', memberList);
        })

        client.on('disconnect', () => {
            //console.log(client.id, 'disconnected')
        });

        client.on('sendJoinRequest', async joinParams => {
            let messageHistory = '';
            switch (joinParams.joinType) {
                case 'group': {
                    messageHistory = await Message.find({ roomId: joinParams.roomId })
                        .populate('from', 'profileImg')
                    client.join(joinParams.roomId);
                    io.to(joinParams.roomId).emit('getChatHistory', messageHistory);
                    break;
                }
                case 'user': {
                    let roomInRoomList = rooms.find(room => room === joinParams.roomId);
                    let reverseRoomId = joinParams.roomId.split('|').reverse().join('|');
                    let reverseRoomIdInList = rooms.find(room => room === reverseRoomId);

                    if (!!roomInRoomList) {
                        client.join(joinParams.roomId);
                        messageHistory = await Message.find({ roomId: joinParams.roomId })
                            .populate('from', 'profileImg')
                        io.to(joinParams.roomId).emit('getChatHistory', messageHistory);
                    }
                    else if (!!reverseRoomIdInList) {

                        client.join(reverseRoomId);
                        messageHistory = await Message.find({ roomId: reverseRoomId })
                            .populate('from', 'profileImg')
                        io.to(reverseRoomId).emit('getChatHistory', messageHistory);

                    }
                    else {
                        rooms.push(joinParams.roomId);
                        client.join(joinParams.roomId);
                        messageHistory = await Message.find({ roomId: joinParams.roomId })
                            .populate('from', 'profileImg')
                        io.to(joinParams.roomId).emit('getChatHistory', messageHistory);
                    }
                    break;
                }
            }
        })

        client.on('chatMessage', async (obj) => {

            const user = await User.findById({ _id: obj.from });
            switch (obj.type) {
                case 'group': {

                    io.to(obj.roomId).emit('newMessage', {
                        from: {
                            profileImg: user.profileImg,
                            _id: user._id
                        },
                        to: obj.to,
                        text: obj.msg,
                        createdAt: Date.now(),
                        roomId: obj.roomId
                    });
                    await Message.create({
                        from: obj.from,
                        to: obj.to,
                        text: obj.msg,
                        roomId: obj.roomId
                    });
                    break;

                }
                case 'user': {
                    let roomInRoomList = rooms.find(room => room === obj.roomId);
                    let reverseRoomId = obj.roomId.split('|').reverse().join('|');
                    let reverseRoomIdInList = rooms.find(room => room === reverseRoomId);
                    if (!!roomInRoomList) {
                        io.to(obj.roomId).emit('newMessage', {
                            from: {
                                profileImg: user.profileImg,
                                _id: user._id
                            },
                            to: obj.to,
                            text: obj.msg,
                            createdAt: Date.now(),
                            roomId: obj.roomId
                        });
                        await Message.create({
                            from: obj.from,
                            to: obj.to,
                            text: obj.msg,
                            roomId: obj.roomId
                        });
                    }
                    else if (!!reverseRoomIdInList) {
                        io.to(reverseRoomId).emit('newMessage', {
                            from: {
                                profileImg: user.profileImg,
                                _id: user._id
                            },
                            to: obj.to,
                            text: obj.msg,
                            createdAt: Date.now(),
                            roomId: reverseRoomId
                        });
                        await Message.create({
                            from: obj.from,
                            to: obj.to,
                            text: obj.msg,
                            roomId: reverseRoomId
                        });
                    }
                    break;
                }
            }
        });
    });
}


