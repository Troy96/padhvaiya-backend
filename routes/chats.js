const express = require('express');
const router = express.Router();
const { ChatController } = require('./../controllers/ChatController');
const chatController = new ChatController();

router.post('/chatHistory', chatController.getChatHistory);


module.exports = router;
