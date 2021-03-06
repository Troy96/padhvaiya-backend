const express = require('express');
const router = express.Router();
const { QuestionController } = require('./../controllers/QuestionController');
const questionController = new QuestionController();
const { authenticate } = require('./../middlewares/interceptor');


router.post('/', questionController.create);
router.get('/', questionController.getAll);
router.get('/:id', questionController.getById);
router.delete('/:id', questionController.deleteById);
router.delete('/', questionController.deleteAll);
router.get('/user/:id', questionController.getByUser);
router.post('/:id/react', questionController.reactionOnQuestion);

module.exports = router;
