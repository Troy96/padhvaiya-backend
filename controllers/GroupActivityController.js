const httCodes = require('http-status');

const { User } = require('../models/user');
const {Group} = require('../models/group');
const { GroupActivity } = require('../models/groupActivity');


class GroupActivityController {

    constructor() { }

    async getAll(req, res) { }

    async getById(req, res) { }

    async deleteAll(req, res) { }

    async deleteById(req, res) { }

    async getActivitiesByUser(req, res) {
        try {
            if (!req.params.hasOwnProperty('userId')) throw new Error('No userId found');
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

    async getActivitiesByGroup(req, res){
        try{
            if(!req.params.hasOwnProperty('groupId')) throw new Error('GroupId not found');
            const groupId = req.params.groupId;
            const groupObj = await Group({_id: groupId});
            
            if(!groupObj) throw new Error('Group not found');

            const activityList = await GroupActivity.find({group: groupId});
            return res.status(httCodes.OK).send(activityList)
        }
        catch(e){
            return res.status(httCodes.INTERNAL_SERVER_ERROR).send({
                error: e
            })
        }
    }


}

module.exports = {
    GroupActivityController
}