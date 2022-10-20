var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var askRouter = require('./routes/ask');
var myasksRouter=require('./routes/myasks');
var updateQuestionRouter=require('./routes/updateQuestion')
var botRouter=require('./routes/botCheck')
var config=require('./config')
var app = express();
var mongoose = require('mongoose')
// connect to mongoDB
mongoose.connect(config.mongoDBpath).then(()=>{
    console.log("mongoDB connected")
}).catch((err) => {
    console.log(err)
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// block requests that are not authenticated
app.use(function(req,res,next){
    const whiteList=[
        '/users/login',
        '/users/register',
        '/check'
    ]
    let found=false
    for(const path of whiteList){
        if(req.originalUrl.indexOf(path)>-1){
            found=true
            break
        }
    }
    if(found){
        next()
    }
    else{
        if(req.cookies.jwt){
            try {
                jwt.verify(req.cookies.jwt, config.jwtSecret)
                next()
            } catch(err) {
                // err
                res.status(401)
                res.redirect('/users/login')
            }
        }
        else{
            res.redirect('/users/login')
        }
    }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(askRouter);
app.use(myasksRouter);
app.use(updateQuestionRouter)
app.use(botRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    if(401 == err.status) {
        res.redirect('/users/login')
    }
});


module.exports = app;
