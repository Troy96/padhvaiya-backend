const httpCodes = require('http-status');

const { Quiz } = require('../models/quiz/quiz');
const { QuizParticipant } = require('../models/quiz/quiz-participant');
const { QuizQuestion } = require('../models/quiz/quiz-question');
const { QuizRule } = require('../models/quiz/quiz-rule');
const { QuizAnswer } = require('../models/quiz/quiz-answer');
const quiz = require('../models/quiz/quiz');
const { EmailController } = require('./EmailController');
const email = new EmailController();


class QuizController {
    constructor() { }

    async create(req, res) {
        try {
            if (!req.body.hasOwnProperty('name')) throw new Error('name not found');
            if (!req.body.hasOwnProperty('desc')) throw new Error('desc not found');
            if (!req.body.hasOwnProperty('isOpenForRegistration')) throw new Error('isOpenForRegistration not found');
            if (!req.body.hasOwnProperty('startTime')) throw new Error('startTime not found');
            if (!req.body.hasOwnProperty('endTime')) throw new Error('endTime not found');
            if (!req.body.hasOwnProperty('startDate')) throw new Error('startDate not found');

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
            if (!req.body.hasOwnProperty('engDesc')) throw new Error('engDesc not found');
            if (!req.body.hasOwnProperty('hindiDesc')) throw new Error('hindiDesc not found');

            if (!req.body.hasOwnProperty('engOptions')) throw new Error('engOptions not found');
            if (!req.body.hasOwnProperty('hindiOptions')) throw new Error('hindiOptions not found');

            if (!req.body.engOptions.length) throw new Error('No engOptions found');
            if (!req.body.hindiOptions.length) throw new Error('No hindiOptions found');

            if (!req.body.hasOwnProperty('ans')) throw new Error('ans not found');

            const reqObj = {
                desc: req.body.desc,
                options: req.body.options,
                ans: req.body.ans,
                engDesc: req.body.engDesc,
                hindiDesc: req.body.hindiDesc,
                engOptions: req.body.engOptions,
                hindiOptions: req.body.hindiOptions,
                quizId
            }

            await QuizQuestion.create(reqObj);

            const quizObj = await Quiz.findById({ _id: quizId });
            quizObj.totalQuestions++;
            await quizObj.save();

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

    async makeQuizOpenForRegistration(req, res) {
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

    async makeQuizCloseForRegistration(req, res) {
        try {
            const quizId = req.params.quizId;

            const quizObj = await Quiz.findById({ _id: quizId });

            if (!quizObj) throw new Error('Quiz not found');

            if (!quizObj['isOpenForRegistration']) {
                return res.status(httpCodes.OK).send({
                    data: 'Quiz is already closed',
                    success: true
                });
            }

            quizObj['isOpenForRegistration'] = false;
            await quizObj.save();

            return res.status(httpCodes.OK).send({
                data: 'Quiz is now closed for registration',
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
            if (!req.body.hasOwnProperty('userId')) throw new Error('userId not found');
            if (!req.body.userId) throw new Error('userid is null');

            if (!req.body.hasOwnProperty('email')) throw new Error('email not found');
            if (!req.body.hasOwnProperty('age')) throw new Error('age not found');
            if (!req.body.hasOwnProperty('phone')) throw new Error('phone not found');



            await QuizParticipant.create({
                ...req.body,
                quizId
            });

            return res.status(httpCodes.OK).send({
                status: true
            })


        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })
        }
    }

    async disqualifyParticipant(req, res) {

    }

    async getParticipants(req, res) {

    }

    async selectAnswer(req, res) {
        try {
            const quizId = req.params.quizId;

            const quizObj = await Quiz.findById({ _id: quizId });
            if (!quizObj) throw new Error('Quiz not found');

            const participantId = req.params.participantId;
            const participantObj = await QuizParticipant.findById({ _id: participantId });
            if (!participantObj) throw new Error('Participant not found');

            if (!participantObj.canAnswer) throw new Error('Participant can not answer');

            const questionId = req.params.questionId;

            if (!req.body.hasOwnProperty('answer')) throw new Error('answer not found');
            const answerGiven = req.body.answer;

            const alreadyAnswered = await QuizAnswer.findOne({ quizId: quizId, participantId: participantId, questionId: questionId });

            if (!!alreadyAnswered) throw new Error('Already answered the question!');

            let reqObj = {
                quizId,
                participantId,
                questionId,
                answerGiven
            }

            const quizQuestion = await QuizQuestion.findById({ _id: questionId });
            if (!quizQuestion) throw new Error('Quiz question not found');
            answerGiven === quizQuestion.ans ? reqObj.isCorrect = true : reqObj.isCorrect = false;


            participantObj['attemptedQuestions']++;
            await participantObj.save();

            await QuizAnswer.create(reqObj);

            return res.status(httpCodes.OK).send({
                status: true
            });


        }

        catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })
        }
    }

    async getParticipantIdByQuiz(req, res) {
        try {
            const quizId = req.params.quizId;
            const userId = req.params.userId;

            const participantObj = await QuizParticipant.findOne({ quizId: quizId, userId: userId });

            if (!participantObj) throw new Error('No participant found!');

            return res.status(httpCodes.OK).send({
                data: participantObj,
                success: true
            })

        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })
        }
    }

    async resultOfParticipantByQuiz(req, res) {
        try {
            const quizId = req.params.quizId;
            const participantId = req.params.participantId;
            let countOfCorrectAns = 0;
            let countOfIncorrectAns = 0;

            const quizAnswers = await QuizAnswer.find({ quizId: quizId, participantId: participantId });
            const totalQuestionsForQuiz = await QuizQuestion.countDocuments({ quizId: quizId });

            if (quizAnswers.length) {
                quizAnswers.forEach(obj => {
                    obj.isCorrect ? countOfCorrectAns++ : countOfIncorrectAns++;
                });
            }

            const respObj = {
                questionsAttempted: countOfIncorrectAns + countOfCorrectAns,
                countOfCorrectAns,
                countOfIncorrectAns,
                totalQuestionsForQuiz
            }

            return res.status(httpCodes.OK).send({
                data: respObj,
                status: true
            })

        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })
        }
    }

    async createLeaderBoardForQuiz(req, res) {
        try {
            const quizId = req.params.quizId;
            let participantCorrectAnsMap = {};
            let rankedParticipantObjs = [];

            const quizParticipants = await QuizParticipant.find({ quizId: quizId });

            (async function next(i) {
                if (i == quizParticipants.length) {
                    const rankedListOfParticipants = Object.keys(participantCorrectAnsMap).sort((a, b) => participantCorrectAnsMap[b] - participantCorrectAnsMap[a]);
                    rankedListOfParticipants.forEach(paticipantId => {
                        const participantObj = quizParticipants.find(obj => obj._id == paticipantId);
                        rankedParticipantObjs.push(participantObj);
                    });

                    return res.status(httpCodes.OK).send({
                        data: rankedParticipantObjs,
                        success: true
                    });

                }
                let countOfCorrectAns = 0;

                const participantObj = quizParticipants[i];
                const quizAnswers = await QuizAnswer.find({ quizId: quizId, participantId: participantObj._id });

                quizAnswers.forEach(answer => {
                    if (answer.isCorrect) countOfCorrectAns++;
                });

                participantCorrectAnsMap[participantObj._id] = countOfCorrectAns;

                return await next(++i);

            })(0);

        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })

        }
    }


    // async makeQuizOver(req, res) {
    //     try {

    //         const quizId = req.params.quizId;
    //         const quizObj = await Quiz.findById({ _id: quizId });
    //         if (!quizObj) throw new Error('Quiz not found');

    //         if (!quizObj.isLive) throw new Error('Quiz is already over');
    //         quizObj.isLive = false;
    //         await quizObj.save();

    //         return res.status(httpCodes.OK).send({
    //             status: true
    //         })


    //     } catch (err) {
    //         return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
    //             error: err.message
    //         })
    //     }
    // }

    async makeQuizOverForParticipant() {
        try {

            const quizId = req.params.quizId;
            const quizObj = await Quiz.findById({ _id: quizId });
            if (!quizObj) throw new Error('Quiz not found');

            const participantId = req.params.participantId;
            const participantObj = await QuizParticipant.findById({ _id: participantId });
            if (!participantObj) throw new Error('Participant not found');

            if (!participantObj.canAnswer) throw new Error('Quiz is already over for participant');

            participantObj.canAnswer = false;
            await participantObj.save();

            return res.status(httpCodes.OK).send({
                status: true
            })


        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })
        }
    }

    // async makeQuizOpen(req, res) {
    //     try {
    //         const quizId = req.params.quizId;
    //         const quizObj = await Quiz.findById({ _id: quizId });
    //         if (!quizObj) throw new Error('Quiz not found');

    //         if (quizObj.isLive) throw new Error('Quiz is already open');
    //         quizObj.isLive = true;
    //         await quizObj.save();

    //         return res.status(httpCodes.OK).send({
    //             status: true
    //         })
    //     } catch (err) {
    //         return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
    //             error: err.message
    //         })
    //     }
    // }

    async sendQuizLink(req, res) {
        try {
            const quizId = req.params.quizId;
            const quizObj = await Quiz.findById({ _id: quizId });
            if (!quizObj) throw new Error('Quiz not found');

            const participants = await QuizParticipant.find({ quizId: quizId });


            (async function next(i) {
                if (i == participants.length) {
                    return res.status(httpCodes.OK).send({
                        status: true
                    })
                }

                let msg = `
                     <p>Hey ${participants[i].first_name}!,</p>
                     <br/>
                     <br/>
                     <p><a href="http://padhvaiya.com/quiz/${quizId}/participants/${participants[i]._id}">here</a> to go to the weekend quiz page and start answering the questions.
                     <br/>
                     <br/>
                     <p>Regards,</p>
                     The Padhvaiya Team`;

                await email.sendMail(participants[i].email, 'Weekend Quiz Link', msg);

                return await next(++i);
            })(0);

        } catch (err) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({
                error: err.message
            })
        }
    }



}

module.exports = {
    QuizController
}