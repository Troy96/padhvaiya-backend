const express = require('express');
const router = express.Router();
const { FileController } = require('./../controllers/FileController');
const fileController = new FileController();
const { authenticate } = require('./../middlewares/interceptor');


router.post('/changePicture', authenticate, fileController.changePicture);


module.exports = router;
