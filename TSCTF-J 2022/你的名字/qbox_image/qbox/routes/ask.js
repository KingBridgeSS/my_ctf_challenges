var express = require('express');
var router = express.Router();
var usersDB=require('../mongoDB/usersDB')
var questionsDB=require('../mongoDB/questionsDB')
var jwt = require('jsonwebtoken');
const config = require("../config");
var uuid = require('uuid');

router.get('/ask', function(req, res, next) {
    res.render('ask');
});
router.post('/ask',async function(req,res){
    const askeeId=req.body.askeeId.trim().toString()
    const askerId = jwt.verify(req.cookies.jwt, config.jwtSecret).userId
    const question=req.body.question.toString()
    if(askeeId&&question){
        if (!await usersDB.findOne({'userId': askeeId})) {
            res.json({
                status:-1,
                msg:'askeeId not exists'
            })
        }
        else{
            await new questionsDB({askerId:askerId,askeeId:askeeId,question:question,answer:"",questionId:uuid.v4()}).save()
            res.json({
                status:1
            })
        }
    }
    else{
        res.json({
            'status':0,
            'msg':'Please enter askeeId and question'
        })
    }
})
module.exports = router;
