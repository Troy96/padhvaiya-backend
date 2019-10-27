var express = require('express');
var router = express.Router();
const { QuestionController } = require('./../controllers/QuestionController');
const questionController = new QuestionController();

router.post('/', questionController.create);
router.get('/', questionController.getAll);
router.get('/:id', questionController.getById);
router.delete('/:id', questionController.deleteById);
router.delete('/', questionController.deleteAll);

module.exports = router;
