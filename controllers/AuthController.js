const { User } = require('./../models/user');
const { Group } = require('./../models/group');
const httpCodes = require('http-status');
const axios = require('axios');

const GOOGLE_OAUTH_TOKEN_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/tokeninfo/?id_token=';

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
            return res.status(httpCodes.OK).send(userObj)
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

    async socialLogin(req, res) {
        try {
            let userSocialData = '';
            let userFromDB = '';
            if (!req.body.hasOwnProperty('socialAccount')) throw new Error('socialAccount not found');
            if (!req.body.hasOwnProperty('authToken')) throw new Error('authToken not found');
            const socialAccount = req.body.socialAccount;
            const authToken = req.body.authToken;
            switch (socialAccount) {
                case 'google': {
                    userSocialData = await axios.get(`${GOOGLE_OAUTH_TOKEN_ENDPOINT + authToken}`);
                    if (!userSocialData.data) throw new Error('Empty response from Google server');
                    const { email } = userSocialData.data;
                    userFromDB = await User.findOne({ email: email }).populate('college');
                    if (!userFromDB) throw new Error('User from social login not registered with us!');
                    break;
                }
                default: {
                    throw new Error('> SOCIAL ACCOUNT NOT HANDLED');
                }
            }

            const groupObj = await Group.findById({college: userFromDB.college});

            const { email, given_name, family_name, name, picture } = userSocialData.data;
            return res.status(httpCodes.OK).send({
                email,
                given_name,
                family_name,
                name,
                picture,
                userId: userFromDB._id,
                college: userFromDB.college,
                hasGroup: groupObj
            });
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            })
        }
    }
}

module.exports = { AuthController }
