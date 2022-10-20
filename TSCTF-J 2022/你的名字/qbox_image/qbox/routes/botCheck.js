var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const config = require("../config");
const bot=require("../bot");
router.get('/check', async function (req, res, next) {
    const id = jwt.verify(req.cookies.jwt, config.jwtSecret).userId
    try {
        await bot.visit(id)
        res.send('ok')
    } catch (e) {
        res.send(e.toString())
    }

});

module.exports = router;
