var express = require('express');
const jwt = require("jsonwebtoken");
const config = require("../config");
const questionsDB = require("../mongoDB/questionsDB");
const usersDB = require("../mongoDB/usersDB");
var router = express.Router();
async function sanitizeAnswer(questions){
    for(q of questions){
        // replace < with html entity
        q.answer=q.answer.replace(/</g,'&lt;')
        // append askee's name
        const askee=await usersDB.findOne({'userId':q.askeeId})
        q.askeeName=askee.username
    }
}
router.get('/myasks', async function(req, res, next) {
    const askerId = jwt.verify(req.cookies.jwt, config.jwtSecret).userId
    // if askeeId is given, we add the condition to the filter
    const filter=req.query.userId?
        {askerId:askerId,askeeId:req.query.userId.toString()} :
        {askerId:askerId}
    const questions=await questionsDB.find(filter)
    await sanitizeAnswer(questions)
    const user=await usersDB.findOne({'userId':askerId})
    res.render('myasks', { 'questions': questions ,'username':user.username});
});

module.exports = router;
