const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    profileImgRef: { type: String, default: null },
    coverImgRef: { type: String, default: null },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date }
})

export const User = mongoose.model('User', UserSchema, 'User');