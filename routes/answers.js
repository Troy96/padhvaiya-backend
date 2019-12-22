const router = require('express').Router();
const { AnswerController } = require('./../controllers/AnswerController');
const answerController = new AnswerController();

router.post('/', answerController.create);
router.get('/', answerController.getAll);
router.get('/:id', answerController.getById);
router.delete('/:id', answerController.deleteById);
router.delete('/', answerController.deleteAll);
router.get('/question/:id', answerController.getByQuestion);
router.get('/user/:id', answerController.getByUser);
router.post('/:id/react', answerController.reactionOnAnswer);

module.exports = router;
