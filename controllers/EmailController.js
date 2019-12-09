const { CONSTANTS } = require('../constants');
const nodeMailer = require('nodemailer');


class EmailController {
   constructor() {
        this.transporter = nodeMailer.createTransport({
            service: CONSTANTS.EMAIL_CONFIG.SERVICE,
            auth: {
                user: CONSTANTS.EMAIL_CONFIG.USER_EMAIL,
                pass: CONSTANTS.EMAIL_CONFIG.USER_PASSWORD
            }
        });
    }

    async sendMail(from, to, subject, messageBody) {
        const mailOptions = {
            from: CONSTANTS.EMAIL_CONFIG.USER_EMAIL,
            to: to,
            subject: subject,
            html: messageBody
        };
        this.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Email sent:' + info.response);
            }
        })
    }
}


module.exports = { EmailController }