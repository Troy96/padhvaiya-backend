const httCodes = require('http-status');

const { User } = require('../models/user');
const { GroupActivity } = require('../models/groupActivity');


class GroupActivityController {

    constructor() { }

    async getAll(req, res) { }

    async getById(req, res) { }

    async deleteAll(req, res) { }

    async deleteById(req, res) { }

    async getActivitiesByUser(req, res) {
        try {
            if (!req.params.userId) throw new Error('No userId found');
            const userId = req.params.userId;
            const userObj = await User.findById({ _id: userId });

            if (!userObj) throw new Error('User not found');

            const activityList = await GroupActivity.find({ user: userId });

            return res.status(httCodes.OK).send(activityList);
        }
        catch (e) {
            return res.status(httCodes.INTERNAL_SERVER_ERROR).send({
                error: e
            })
        }
    }


}

module.exports = {
    GroupActivityController
}