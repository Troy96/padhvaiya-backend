const mongoose = require('mongoose');

const validator = require('validator');

const ContactUsSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, validate: { validator: validator.isEmail, message: 'Not a valid email' } },
    message: { type: String, default: null, trim: true }
})

const ContactUs = mongoose.model('ContactUs', ContactUsSchema, 'ContactUs');

module.exports = {
    ContactUs
}