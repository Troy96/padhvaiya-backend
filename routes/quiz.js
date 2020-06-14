const router = require('express').Router();
const {QuizController} = require('../controllers/QuizController');

const quiz = new QuizController();

router.post('/create', quiz.create)
router.post('/:quizId/register', quiz.registerParticipant);
router.get('/', quiz.getAll)
router.get('/:quizId', quiz.getById);
router.get('/:quizId/questions', quiz.getQuizQuestions);
router.get('/:quizId/questions', quiz.createQuizQuestion);

module.exports = router;