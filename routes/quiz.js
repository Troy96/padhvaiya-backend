const router = require('express').Router();
const { QuizController } = require('../controllers/QuizController');

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
router.post('/:quizId/participants/:participantId/questions/:questionId', quiz.selectAnswer);
router.get('/:quizId/users/:userId/', quiz.getParticipantIdByQuiz);
router.get('/:quizId/participants/:participantId/result', quiz.resultOfParticipantByQuiz);
router.get('/:quizId/leaderboard', quiz.createLeaderBoardForQuiz);

module.exports = router;