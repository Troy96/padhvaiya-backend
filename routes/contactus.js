const express = require('express');
const router = express.Router();

const { ContactUsController } = require('../controllers/ContactUsController');

const contactUsController = new ContactUsController();


router.post('/', contactUsController.create);

module.exports = router;