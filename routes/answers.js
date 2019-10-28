var express = require('express');
var router = express.Router();
const { AnswerController } = require('./../controllers/AnswerController');
const answerController = new AnswerController();

router.post('/', answerController.create);
router.get('/', answerController.getAll);
router.get('/:id', answerController.getById);
router.delete('/:id', answerController.deleteById);
router.delete('/', answerController.deleteAll);

module.exports = router;
