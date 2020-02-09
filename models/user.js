const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, validate: { validator: validator.isEmail, message: `Not a valid email` } },
    password: { type: String, required: true, minlength: 6, trim: true },
    questions: [{ type: mongoose.Types.ObjectId, ref: 'Question', default: [] }],
    answers: [{ type: mongoose.Types.ObjectId, ref: 'Answer', default: [] }],
    token: { type: String },
    college: { type: mongoose.Types.ObjectId, ref: 'College' },
    profileImg: { type: String, default: 'http://via.placeholder.com/170x170' },
    coverImg: { type: String, default: 'http://via.placeholder.com/1600x400' },
    idCardImg: { type: String, default: null },
    lastSeen: {type: String, default: null},
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
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

UserSchema.pre('findOneAndUpdate', function (next) {
    let user = this;
    user.update({}, { $set: { updatedAt: new Date() } });
    next();
});


UserSchema.statics.verifyCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email: email }).populate('college')
        .then(user => {
            if (!user) return Promise.reject('User not found!');
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) resolve(user);
                    else reject('Wrong passwords!');
                })
            })
        })
}


UserSchema.methods.generateAuthToken = async function () {
    let user = this;
    let email = user.email;
    let token = jwt.sign({ _id: user._id.toHexString(), email }, process.env.JWT_SECRET).toString();
    user.token = token;
    await user.save();
    return token;
}

UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject('Error in validating token!');
    }
    return User.findOne({
        token: token
    })
}

const User = mongoose.model('User', UserSchema, 'User');

module.exports = { User }