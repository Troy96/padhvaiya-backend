require('./db/conn');
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const questionsRouter = require('./routes/questions');
const answerRouter = require('./routes/answers');
const postRouter = require('./routes/post');
const authRouter = require('./routes/auth');
const commentRouter = require('./routes/comments');
const collegeRouter = require('./routes/college');
const groupRouter = require('./routes/group');
const fileRouter = require('./routes/files');
const passwordResetRouter = require('./routes/resetPassword');
const notesRouter = require('./routes/notes');
const groupActivityRouter = require('./routes/groupActivity');
const chatRouter = require('./routes/chats');
const contactUsRouter = require('./routes/contactus');

const app = express();

// view engine setup
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: '*',
  preflightContinue: true,
  methods: 'GET, HEAD, PUT, POST, DELETE'
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questions', questionsRouter);
app.use('/answers', answerRouter);
app.use('/auth', authRouter);
app.use('/files', fileRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/colleges', collegeRouter);
app.use('/groups', groupRouter);
app.use('/resetPassword', passwordResetRouter);
app.use('/notes', notesRouter);
app.use('/activity', groupActivityRouter);
app.use('/chats', chatRouter);
app.use('/contactus', contactUsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
