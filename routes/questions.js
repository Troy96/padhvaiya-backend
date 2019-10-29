var express = require('express');
var router = express.Router();
const { QuestionController } = require('./../controllers/QuestionController');
const questionController = new QuestionController();
const { authenticate } = require('./../middlewares/interceptor');


router.post('/', authenticate, questionController.create);
router.get('/', questionController.getAll);
router.get('/:id', questionController.getById);
router.delete('/:id', questionController.deleteById);
router.delete('/', questionController.deleteAll);
router.get('/user/:id', questionController.getByUser);

module.exports = router;
