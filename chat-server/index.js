
const { Group } = require('../models/group');
const { User } = require('../models/user');
const { Message } = require('../models/message');
const { ChatController } = require('../controllers/ChatController');

const chatController = new ChatController();


module.exports = function (io) {

    io.on('connection', client => {

        console.log('connected', client.id)

        client.on('userIsOnline', chatController.handlerUserIsOnline);

        client.on('userIsOffline', chatController.handlerUserIsOffline);

        client.on('getGroupMembers', async groupId => {
            const groupObj = await Group.findById({ _id: groupId })
                .populate('admins')
                .populate('members');
            const memberList = groupObj['admins'].concat(groupObj['members']);
            client.emit('onGroupMembers', memberList);
        })

        client.on('join', async (joinParams, callback) => {
            const userObj = await User.findById({ _id: joinParams.userId });
            client.join(joinParams.roomId);
            const messageHistory = await Message.find({ roomId: joinParams.roomId })

            io.to(joinParams.roomId).emit('getChatHistory', messageHistory);
            //client.emit('chatMessage', `Welcome to the group, ${userObj.first_name}`);
            client.broadcast.to(joinParams.roomId).emit('chat message', `${userObj.first_name} joined`)
            callback();
        })


        client.on('disconnect', () => {
            console.log(client.id, 'disconnected')
        });

        client.on('chat message', async (obj) => {
            console.log(obj,'------------------');
            await Message.create({
                from: obj.from,
                to: obj.to,
                text: obj.msg,
                roomId: obj.roomId
            });
            client.emit('chatMessage', `new msg client`);

            io.to(obj.roomId).emit('chatMessage', 'testttt');

        });
    });
}


