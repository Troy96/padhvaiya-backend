const { College } = require('./../models/college');
const httpCodes = require('http-status');

class CollegeController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('name')) throw new Error('name property not found!');
            if (!req.body.hasOwnProperty('address')) throw new Error('address property not found!');
            if (!req.body.hasOwnProperty('email')) throw new Error('email property not found!');
            if (!req.body.hasOwnProperty('phone')) throw new Error('phone property not found!');
            let dbObj;
            dbObj = {
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                phone: req.body.phone
            };
            const newCollege = new College(dbObj);
            await newCollege.save();

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
            const collegeList = await College.find({})
                .populate('group');
            return res.status(httpCodes.OK).send(collegeList)
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const collegeId = req.params.id;
            const collegeObj = await College.findOne({ _id: collegeId })
                .populate('college')
            if (!collegeObj) throw new Error('College not found!');
            return res.status(httpCodes.OK).send(collegeObj);
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
            const collegeId = req.params.id;
            await College.findByIdAndDelete({ _id: collegeId });
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
            await College.deleteMany();
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

module.exports = { CollegeController }
