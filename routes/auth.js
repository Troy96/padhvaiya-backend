var express = require('express');
var router = express.Router();
const { AuthController } = require('./../controllers/AuthController');
const authController = new AuthController();

router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
