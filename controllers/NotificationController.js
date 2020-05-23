const httpCodes = require('http-status');
const { Notification } = require('./../models/notification');

class NotificationController {
    constructor() { }

    async getAll(req, res) {
        try {
            const notificationList = await Notification.find({});
            return res.status(httpCodes.OK).send(notificationList);
        }

        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            })
        }
    }
}

module.exports = {
    NotificationController
}