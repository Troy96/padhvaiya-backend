const { User } = require('../models/user');
const { EmailController } = require('./EmailController');
const httpCodes = require('http-status');
const jwt = require('jsonwebtoken');

const emailController = new EmailController();

class PasswordResetController {
    constructor() { }

    async forgotPassword(req, res) {
        try {
            if (!req.body.hasOwnProperty('email')) throw new Error('Email not found!');
            const email = req.body.email;
            const user = await User.findOne({ email: email });
            if (!user) throw new Error('User with email not found');
            const payload = { id: user.id, email: email }
            const secretKey = user.password.concat('-').concat(user.createdAt.getTime());
            const oneTimeToken = jwt.sign(payload, secretKey);
            const passwordResetLink = `https://api-padhvaiya.herokuapp.com/resetPassword/${user.id}/${oneTimeToken}`;
            const htmlBody =
                `<html>
                <body>
                    <p>Hi,</p>
                    <p>Your password reset link is given below. Kindly click on the given below link 
                    and you will be redirected to page where you will have to create a new password. This is a one-time, system generated link! </p>
                    <h3><a href=${passwordResetLink}>${passwordResetLink}</a></h3>
                </body>
            </html>`
            await emailController.sendMail(email, 'Padhvaiya: Password Reset Link', htmlBody);
            return res.status(httpCodes.OK).send({
                success: true
            })
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }


    async sendResetForm(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('id not found!');
            const userId = req.params.id;
            const userObj = await User.findById({ _id: userId });
            if (!userObj) throw new Error('User not found');
            const secretKey = userObj.password.concat('-').concat(userObj.createdAt.getTime());
            const decodedPayload = jwt.decode(req.params.token, secretKey);
            if (decodedPayload.email != userObj.email) throw new Error('Bad token!');
            if (decodedPayload.id != userObj._id) throw new Error('Bad token');
            return res.send('<form action="/resetPassword/new" method="POST">' +
                '<input type="hidden" name="id" value="' + decodedPayload.id + '" />' +
                '<input type="hidden" name="token" value="' + req.params.token + '" />' +
                '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
                '<input type="submit" value="Reset Password" />' +
                '</form>');
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async createNewPassword(req, res) {
        try {
            const userId = req.body.id;
            const userObj = await User.findById({ _id: userId });
            if (!userObj) throw new Error('User not found');
            const secretKey = userObj.password.concat('-').concat(userObj.createdAt.getTime());
            const decodedPayload = jwt.decode(req.body.token, secretKey);
            if (decodedPayload.email != userObj.email) throw new Error('Bad token!');
            if (decodedPayload.id != userObj._id) throw new Error('Bad token');
            userObj['password']= req.body.password;
            await userObj.save();
            return res.status(httpCodes.OK).send('Your password was changed successfully!')
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

}

module.exports = { PasswordResetController }