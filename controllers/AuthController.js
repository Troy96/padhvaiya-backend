const { Question } = require('./../models/question');
const { User } = require('./../models/user');
const { Answer } = require('./../models/answer');
const httpCodes = require('http-status');

class AuthController {
    constructor() { }

    async login(req, res) {
        try {
            if (!req.body.hasOwnProperty('email')) throw new Error('email property not found!');
            if (!req.body.hasOwnProperty('password')) throw new Error('password property not found!');
            const email = req.body.email;
            const password = req.body.password;
            const userObj = await User.verifyCredentials(email, password);
            const token = await userObj.generateAuthToken();
            return res.status(httpCodes.OK).send({
                token: token
            })
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message ? e.message : e
            });
        }
    }

    async logout(req, res) {
        try {
            const token = req.header('Authorization');
            if (!token) throw new Error('Token not found!');
            const userByToken = await User.findByToken(token);
            if (!userByToken) throw new Error('User with token not found!');
            userByToken.token = null;
            await userByToken.save();
            return res.sendStatus(httpCodes.OK);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message ? e.message : e
            });
        }

    }
}

module.exports = { AuthController }
