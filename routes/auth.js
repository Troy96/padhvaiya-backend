const express = require('express');
const router = express.Router();
const { AuthController } = require('./../controllers/AuthController');
const authController = new AuthController();

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/socialLogin', authController.socialLogin);

module.exports = router;
