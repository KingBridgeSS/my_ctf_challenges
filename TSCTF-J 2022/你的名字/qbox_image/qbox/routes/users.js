var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config=require('../config')
var usersDB=require('../mongoDB/usersDB')
var uuid = require('uuid');
const questionsDB = require("../mongoDB/questionsDB");
function checkUserName(username){
  return username.length<=10
}
// login page
router.get('/login',(req,res,next)=>{
  res.render('login')
})
// login api
router.post('/login', async (req, res, next) => {
  const username = req.body.username.toString()
  const password = req.body.password.toString()

  if(username&&password){
    // assume we get userid by req.body
    const user=await usersDB.findOne({'username':username,'password':password})
    if(user){
      // console.log(user.userId)
      const token = jwt.sign({'userId':user.userId}, config.jwtSecret);
      res.cookie('jwt',token,{
        path:'/',
        maxAge:1000*60*60*24*365 // 1 year
      })
      res.json({
        status:1,
        msg:'Login success!',
      });
    }
    else{
      res.json({
        status:-1,
        msg:'username or password error'
      })
    }

  }
  else{
    res.json({
      status:0,
      msg:'Please provide username and password!'
    })
  }
});
// info page
router.get('/info',async(req,res,next)=>{
  const userId = jwt.verify(req.cookies.jwt, config.jwtSecret).userId;
  // console.log(userId)
  const user=await usersDB.findOne({'userId':userId})
  res.render('info',{info:{"userId":userId,"username":user.username,"password":user.password}})
})
// update info api
router.post('/info',async(req,res,next)=>{
  const userId = jwt.verify(req.cookies.jwt, config.jwtSecret).userId;
  const username = req.body.username.toString()
  const password = req.body.password.toString()
  if(!checkUserName(username)){
    res.json({
      status:-2,
      msg:'username must not longer then 10 characteristics'
    })
    return
  }
  if (username && password) {
    await usersDB.updateOne({'userId':userId}, { $set: { 'username': username,'password':password } });
    res.json({
      status:1
    })
  }
  else{
    res.json({
      status:0,
      msg: 'Please provide username and password!'
    })
  }

})
// register page
router.get('/register',(req,res,next)=>{
  res.render('register')
})
// register api
router.post('/register', async (req, res, next) => {
  const username = req.body.username.toString()
  const password = req.body.password.toString()
  if(!checkUserName(username)){
    res.json({
      status:-2,
      msg:'username must not longer than 10 characteristics'
    })
    return
  }
  if (username && password) {
    // 弟弟妹妹们的exp可能是一样的hh，重名限制删咯
    // if (await usersDB.findOne({'username': username})) {
    //   res.json({
    //     status:-1,
    //     msg:'username exists'
    //   })
    //   return
    // }
    const userId=uuid.v4()
    await new usersDB({'username':username,'password':password,'userId':userId}).save()
    // force add a question
    await new questionsDB({
      askerId:config.flagUserId,
      askeeId:userId,
      question:config.defaultQuestion,
      answer:"",
      questionId:uuid.v4()}).save()
    const token = jwt.sign({'userId': userId}, config.jwtSecret)
    res.cookie('jwt', token, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24*365 // 1 year
    })
    res.json({
      status: 1,
      msg: 'Register success!',
    });
  } else {
    res.json({
      status: 0,
      msg: 'Please provide username and password!'
    })
  }
});
module.exports = router;
