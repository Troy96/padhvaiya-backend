const { CONSTANTS } = require('../constants');
const nodeMailer = require('nodemailer');


class EmailController {
    constructor() {
        this.transporter = nodeMailer.createTransport({
<<<<<<< HEAD
            service: CONSTANTS.EMAIL_CONFIG.SERVICE,
            secureConnection: false,
            port: 587,
            tls: {
                ciphers: 'SSLv3'
            },
=======
            host: CONSTANTS.EMAIL_CONFIG.HOST,
>>>>>>> dev
            auth: {
                user: CONSTANTS.EMAIL_CONFIG.USER_EMAIL,
                pass: CONSTANTS.EMAIL_CONFIG.USER_PASSWORD
            }
        });
    }

    async sendMail(to, subject, messageBody) {
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