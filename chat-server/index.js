const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    pingInterval: 600000,
    pingTimeout: 600000
});
const {Group} = require('../models/group');
const {User} = require('../models/user');
const { ChatController } = require('../controllers/ChatController');
require('./../db/conn');

const chatController = new ChatController();


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', client => {

    console.log('client connected', client.id);

    client.on('userIsOnline', chatController.handlerUserIsOnline);

    client.on('userIsOffline', chatController.handlerUserIsOffline);

    client.on('getGroupMembers', async groupId => {
        const groupObj = await Group.findById({ _id: groupId })
            .populate('admins')
            .populate('members');
        const memberList = groupObj['admins'].concat(groupObj['members']);
        client.emit('onGroupMembers', memberList);
    })

    client.on('join', async (joinParams, callback)=>{
        const userObj = await User.findById({_id: joinParams.userId});
        console.log(userObj);
        client.join(joinParams.groupId);
        client.emit('chat message', `Welcome to the group, ${userObj.first_name}`);
        client.broadcast.to(joinParams.groupId).emit('chat message', `${userObj.first_name} joined`)
        callback();
    })


    client.on('disconnect', ()=> {
        console.log(client.id, 'disconnected')
    });

    client.on('chat message', (obj) => {
        console.log(obj);

       io.to(obj.groupId).emit('chat message', obj.msg);
    });
});

server.listen(3001, err => {
    if (err) throw err;
    console.log('Chat server listeninig...');
})