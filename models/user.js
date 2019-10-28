const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    questions: [{ type: mongoose.Types.ObjectId, ref: 'Question', default: [] }],
    answers: [{ type: mongoose.Types.ObjectId, ref: 'Answer', default: [] }],
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date }
})

UserSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                return next();
            })
        })
    }
    else return next();
});

const User = mongoose.model('User', UserSchema, 'User');

module.exports = { User }