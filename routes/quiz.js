const router = require('express').Router();
const { QuizController } = require('../controllers/QuizController');

const quiz = new QuizController();

router.post('/create', quiz.create)
router.post('/:quizId/register', quiz.registerParticipant);
router.get('/', quiz.getAll);
router.get('/:quizId', quiz.getById);
router.get('/:quizId/questions', quiz.getQuizQuestions);
router.post('/:quizId/questions', quiz.createQuizQuestion);
router.put('/:quizId/questions/:questionId', quiz.editQuizQuestion);
router.get('/:quizId/questions/:questionId', quiz.getQuizQuestionById);


router.post('/:quizId/rules', quiz.createQuizRules);
router.get('/:quizId/rules', quiz.getQuizRules);
router.get('/:quizId/openForRegistration', quiz.makeQuizOpenForRegistration);
router.get('/:quizId/closeForRegistration', quiz.makeQuizCloseForRegistration);
router.post('/:quizId/participants/:participantId/questions/:questionId', quiz.selectAnswer);
router.get('/:quizId/users/:userId/', quiz.getParticipantIdByQuiz);
router.get('/:quizId/participants/:participantId/result', quiz.resultOfParticipantByQuiz);
router.get('/:quizId/leaderboard', quiz.createLeaderBoardForQuiz);
// router.get('/:quizId/open', quiz.makeQuizOpen);
// router.get('/:quizId/close', quiz.makeQuizOver);
router.get('/:quizId/sendQuizLink', quiz.sendQuizLink);
router.get('/:quizId/participants/:participantId/close', quiz.makeQuizOverForParticipant);
router.get('/:quizId/participants/:participantId/attemptedQuestions', quiz.participantAttemptedQuestionCount);
router.get('/:quizId/participants', quiz.getParticipants);
router.get('/:quizId/participants/:participantId', quiz.getParticipantDetails);





module.exports = router;