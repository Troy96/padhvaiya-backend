const { Group } = require('./../models/group');
const httpCodes = require('http-status');

class GroupController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('name')) throw new Error('name property not found!');
            if (!req.body.hasOwnProperty('desc')) throw new Error('desc property not found!');
            if (!req.body.hasOwnProperty('groupCreator')) throw new Error('groupCreator property not found!');
            if (!req.body.hasOwnProperty('college')) throw new Error('college property not found!');

            let dbObj;
            dbObj = {
                name: req.body.name,
                desc: req.body.desc,
                groupCreator: req.body.groupCreator,
                college: req.body.college,
                admins: [req.body.groupCreator],
                members: [req.body.groupCreator]
            };
            const newGroup = new Group(dbObj);
            await newGroup.save();

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

    async getAll(req, res) {
        try {
            const groupList = await Group.find()
                .populate('groupCreator')
                .populate('college')
                .populate({
                    path: 'admins',
                    model: 'User'
                })
                .populate({
                    path: 'members',
                    model: 'User'
                })
            return res.status(httpCodes.OK).send(groupList)
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const groupId = req.params.id;
            const groupObj = await Group.findOne({ _id: groupId })
                .populate('groupCreator')
                .populate('college')
                .populate({
                    path: 'admins',
                    model: 'User'
                })
                .populate({
                    path: 'members',
                    model: 'User'
                })
            if (!groupObj) throw new Error('Group not found!');
            return res.status(httpCodes.OK).send(groupObj);
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async deleteById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const groupId = req.params.id;
            await Group.findByIdAndDelete({ _id: groupId });
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

    async deleteAll(req, res) {
        try {
            await Group.deleteMany();
            return res.status(httpCodes.OK).send({
                success: true
            });
        }
        catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }
}

module.exports = { GroupController }
