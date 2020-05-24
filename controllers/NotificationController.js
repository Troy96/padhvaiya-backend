const httpCodes = require('http-status');
const { Notification } = require('./../models/notification');
const { User } = require('./../models/user');


class NotificationController {
    constructor() { }

    async getAll(req, res) {
        try {
            let userObj = {};

            const notificationList = await Notification.find({})
                .populate('actor');

            userObj = await User.findById({ _id: req.params.userId });

            if (!userObj) throw new Error('User not found!');
            let uncheckedNotifCount = 0;

            notificationList.forEach(
                notif => {
                    console.log(new Date(notif.createdAt).getTime(), new Date(userObj.lastNotificationsCheckedAt).getTime());
                    if (new Date(notif.createdAt).getTime() > new Date(userObj.lastNotificationsCheckedAt).getTime()) uncheckedNotifCount++;
                }
            )

            userObj['lastNotificationsCheckedAt'] = Date.now();
            await userObj.save();

            return res.status(httpCodes.OK).send({
                data: notificationList,
                uncheckedNotifCount: uncheckedNotifCount
            });
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