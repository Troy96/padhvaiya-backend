const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, default: null }
})

const Room = mongoose.model('Room', RoomSchema, 'Room');

module.exports = {
    Room
}