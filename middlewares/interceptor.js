const { User } = require('./../models/user');
const httpCodes = require('http-status');

const authenticate = async (req, res, next) => {
    try {
        console.log('1')
        const token = req.header('Authorization');
        if (!token) throw new Error('Token not found');
        const userByToken = await User.findByToken(token);
        if (!userByToken) throw new Error('User with token not found!');
        next();
    } catch (e) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
            error: e.message ? e.message : e
        })
    }

}

module.exports = { authenticate };