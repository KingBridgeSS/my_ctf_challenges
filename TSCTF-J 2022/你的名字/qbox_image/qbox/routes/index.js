var express = require('express');
const jwt = require("jsonwebtoken");
const config = require("../config");
const questionsDB = require("../mongoDB/questionsDB");
const usersDB = require("../mongoDB/usersDB");
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  const userId = jwt.verify(req.cookies.jwt, config.jwtSecret).userId
  const questions=await questionsDB.find({askeeId:userId})
  res.render('index', { 'questions': questions });
});

module.exports = router;
