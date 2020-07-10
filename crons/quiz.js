const Cron = require('node-schedule');
const moment = require('moment');
const { Quiz } = require('../models/quiz/quiz');

class QuizCron {

    constructor() { }


    async makeQuizLive() {
        return Cron.scheduleJob('0 0 5 * * FRI', () => {

            const currentDate = moment().format('L');

            const quiz = await Quiz.findOne({ startDate: currentDate });
            if (!quiz) throw new Error('Quiz not found');

            quiz['isLive'] = true;
            await quiz.save();
        })
    }
}

module.exports = { QuizCron }