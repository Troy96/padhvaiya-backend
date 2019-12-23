const express = require('express');
const router = express.Router();

const { PasswordResetController } = require('../controllers/PasswordResetController');
const passwordResetController = new PasswordResetController;

router.post('/', passwordResetController.forgotPassword);
router.get('/:id/:token', passwordResetController.sendResetForm);
router.post('/new', passwordResetController.createNewPassword);

module.exports = router;
