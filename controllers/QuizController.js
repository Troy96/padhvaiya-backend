const httpCodes = require('http-status');

const { Quiz } = require('../models/quiz/quiz');
const { QuizParticipant } = require('../models/quiz/quiz-participant');
const { QuizQuestion } = require('../models/quiz/quiz-question');
const { QuizRule } = require('../models/quiz/quiz-rule');


class QuizController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('name')) throw new Error('name not found');
            if (!req.body.hasOwnProperty('desc')) throw new Error('desc not found');
            if (!req.body.hasOwnProperty('isOpenForRegistration')) throw new Error('isOpenForRegistration not found');
            if (!req.body.hasOwnProperty('timestamp')) throw new Error('timestamp not found');

            await Quiz.create({
                ...req.body
            });

            return res.status(httpCodes.OK).send({
                success: true
            });

        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                status: err.message
            })

        }
    }

    async deleteById(req, res) {

    }

    async getById(req, res) {
        try {
            const quizId = req.params.quizId;
            const quizObj = await Quiz.findById({ _id: quizId });

            if (!quizObj) throw new Error('Quiz not found');

            return res.status(httpCodes.OK).send({
                data: quizObj,
                success: true
            })
        }

        catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message,
                status: false
            })
        }
    }

    async getAll(req, res) {
        try {
            const quizes = await Quiz.find({});
            return res.status(httpCodes.OK).send({
                data: quizes,
                success: true
            })
        }

        catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message,
                success: false
            })
        }
    }

    async deleteAll(req, res) {

    }

    async createQuizQuestion(req, res) {
        try {

            const quizId = req.params.quizId;
            if (!req.body.hasOwnProperty('desc')) throw new Error('desc not found');
            if (!req.body.hasOwnProperty('options')) throw new Error('options not found');
            if (!req.body.options.length) throw new Error('No options found');
            if (!req.body.hasOwnProperty('ans')) throw new Error('ans not found');

            const reqObj = {
                desc: req.body.desc,
                options: req.body.options,
                ans: req.body.ans,
                quizId
            }

            await QuizQuestion.create(reqObj);

            return res.status(httpCodes.OK).send({
                success: true
            })

        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })
        }
    }

    async createQuizRules(req, res) {
        try {
            const quizId = req.params.quizId;

            if (!req.body.hasOwnProperty('desc')) throw new Error('rules not found');
            if (!req.body.desc) throw new Error('No rule found');

            const reqObj = {
                quizId,
                desc: req.body.desc
            }

            await QuizRule.create(reqObj);

            return res.status(httpCodes.OK).send({
                success: true
            });

        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })
        }
    }

    async getQuizRules(req, res) {
        try {
            const quizId = req.params.quizId;
            const rules = await QuizRule.find({ quizId: quizId }).populate('quizId');
            return res.status(httpCodes.OK).send({
                data: rules,
                success: true
            })

        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })
        }
    }

    async getQuizQuestions(req, res) {
        try {
            const quizId = req.params.quizId;
            const questions = await QuizQuestion.find({ quizId: quizId });

            return res.status(httpCodes.OK).send({
                data: questions,
                success: true
            });

        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })
        }
    }

    async getQuizQuestionById(req, res) {
        try {
            const questionId = req.params.questionId;

            const quesObj = await QuizQuestion.findById({ _id: questionId });

            return res.status(httpCodes.OK).send({
                data: quesObj,
                success: true
            })
        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })
        }
    }

    async checkIfQuizIsOpen(req, res) {
        try {
            const openQuiz = await Quiz.find({ isOpenForRegistration: true });

            return res.status(httpCodes.OK).send({
                data: openQuiz,
                success: true
            });

        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                status: err.message
            })
        }
    }

    async makeQuizOpen(req, res) {
        try {
            const quizId = req.params.quizId;

            const quizObj = await Quiz.findById({ _id: quizId });

            if (!quizObj) throw new Error('Quiz not found');

            if (quizObj['isOpenForRegistration']) {
                return res.status(httpCodes.OK).send({
                    data: 'Quiz is already open',
                    success: true
                });
            }

            quizObj['isOpenForRegistration'] = true;
            await quizObj.save();

            return res.status(httpCodes.OK).send({
                data: 'Quiz is now open for registration',
                success: true
            });

        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                status: err.message
            })
        }
    }

    async registerParticipant(req, res) {
        try {
            const quizId = req.params.quizId;
            const quizObj = await Quiz.findById({ _id: quizId });

            if (!quizObj) throw new Error('Quiz not found');
            if (!quizObj['isOpenForRegistration']) throw new Error('Quiz is not open for registration');

            if (!req.body.hasOwnProperty('name')) throw new Error('name not found');
            if (!req.body.hasOwnProperty('email')) throw new Error('email not found');
            if (!req.body.hasOwnProperty('age')) throw new Error('age not found');
            if (!req.body.hasOwnProperty('phone')) throw new Error('phone not found');


            await QuizParticipant.create({
                ...req.body
            });

            return res.status(httpCodes.OK).send({
                status: true
            })


        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                status: err.message
            })
        }
    }

    async disqualifyParticipant() {

    }

    async getParticipants() {

    }

}

module.exports = {
    QuizController
}