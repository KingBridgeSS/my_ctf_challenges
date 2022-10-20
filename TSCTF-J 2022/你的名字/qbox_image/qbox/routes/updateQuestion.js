var express = require('express');
var router = express.Router();
var questionsDB=require('../mongoDB/questionsDB')
var jwt = require('jsonwebtoken');
const config = require("../config");
const bot = require("../bot");

router.post('/question/update',async function(req,res){
    // verify the question's askee is the user
    const askeeId = jwt.verify(req.cookies.jwt, config.jwtSecret).userId
    const questionId=req.body.questionId.toString()
    const answer=req.body.answer.toString()
    const result=await questionsDB.findOne({askeeId:askeeId,questionId:questionId})
    if(result){
        await questionsDB.updateOne({questionId:questionId},{$set:{answer:answer}})
        res.send({
            status:1
        })

    }
    else{
        res.send({
            status:0,
            msg:'dont do this...'
        })
    }
})
router.post('/question/delete',async function(req,res){
    const id = jwt.verify(req.cookies.jwt, config.jwtSecret).userId
    const questionId=req.body.questionId.toString()
    const result=await questionsDB.findOne({asker:id,questionId:questionId})
    if(result){
        await questionsDB.deleteOne({questionId:questionId})
        res.send({
            status:1
        })

    }
    else{
        res.send({
            status:0,
            msg:'dont do this...'
        })
    }
})
module.exports = router;
