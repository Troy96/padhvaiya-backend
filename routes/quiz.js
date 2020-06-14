const router = require('express').Router();
const {QuizController} = require('../controllers/QuizController');

const quiz = new QuizController();

router.post('/create', quiz.create)
router.post('/:quizId/register', quiz.registerParticipant);
router.get('/', quiz.getAll)
router.get('/:quizId', quiz.getById);
router.get('/:quizId/questions', quiz.getQuizQuestions);
router.post('/:quizId/questions', quiz.createQuizQuestion);
router.post('/:quizId/rules', quiz.createQuizRules);
router.get('/:quizId/rules', quiz.getQuizRules);
router.get('/:quizId/openForRegistration', quiz.makeQuizOpen);
router.get('/:quizId/closeForRegistration', quiz.makeQuizClose);

module.exports = router;