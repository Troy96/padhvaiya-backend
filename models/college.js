const mongoose = require('mongoose');
const validator = require('validator');

const CollegeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, validate: { validator: validator.isEmail, message: `Not a valid email` } },
    phone: { type: Number, required: true, min: 6000000000, max: 9999999999 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const College = mongoose.model('College', CollegeSchema, 'College');

module.exports = { College };
