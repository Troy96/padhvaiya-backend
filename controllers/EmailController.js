const { CONSTANTS } = require('../constants');
var nodeoutlook = require('nodejs-nodemailer-outlook')
nodeoutlook.sendEmail

class EmailController {
    constructor() {
    }

    async sendViaMail(to, subject, messageBody) {
        nodeoutlook.sendEmail({
            auth: {
                user: CONSTANTS.EMAIL_CONFIG.USER_EMAIL,
                pass: CONSTANTS.EMAIL_CONFIG.USER_PASSWORD
            },
            from: CONSTANTS.EMAIL_CONFIG.USER_EMAIL,
            to: to,
            subject: subject,
            html: messageBody,
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        })
    }
}


module.exports = { EmailController }