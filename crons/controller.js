const { QuizCron } = require('./quiz');
const quiz = new QuizCron();

try {
    quiz.makeQuizLive();
}

catch (err) {
    console.log(err)
}
