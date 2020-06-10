const router = require('express').Router();
const {QuizController} = require('../controllers/QuizController');

const quiz = new QuizController();

router.post('/create', quiz.create)
router.post('/:quizId/register', quiz.registerParticipant);

module.exports = router;