const { ContactUs } = require('../models/contact-us');
const httpCodes = require('http-status');

class ContactUsController {
    constructor() { }

    async create(req, res) {
        console.log('--------------------');
        try {
            if (!req.body.hasOwnProperty('name')) throw new Error('name property not found!');
            if (!req.body.hasOwnProperty('email')) throw new Error('email property not found!');
            if (!req.body.hasOwnProperty('message')) throw new Error('message property not found!');
            let dbObj;
            dbObj = {
                name: req.body.name,
                email: req.body.email,
                message: req.body.message,
            };
            await ContactUs.create(dbObj);
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
            const contactUsList = await ContactUs.find({})
            return res.status(httpCodes.OK).send(contactUsList)
        } catch (e) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: e.message
            });
        }
    }

    async getById(req, res) {
        try {
            if (!req.params.hasOwnProperty('id')) throw new Error('Property id not found');
            const contactUsId = req.params.id;
            const contactUsObj = await ContactUs.findOne({ _id: contactUsId })
            if (!contactUsObj) throw new Error('contactUsObj not found!');
            return res.status(httpCodes.OK).send(contactUsObj);
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
            const contactUsId = req.params.id;
            await ContactUs.findByIdAndDelete({ _id: contactUsId });
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
            await ContactUs.deleteMany();
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


module.exports = {
    ContactUsController
}