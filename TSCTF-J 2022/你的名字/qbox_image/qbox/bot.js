const puppeteer = require('puppeteer');
const jwt = require("jsonwebtoken");
const config = require("./config");
function Bot() { }
Bot.prototype.visit=async function(userId){
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    const token = jwt.sign({'userId':config.flagUserId}, config.jwtSecret);
    await page.setCookie({
        name:'jwt',
        value:token,
        path: "/",
        domain:'127.0.0.1',
        httpOnly:true
    })
    await page.goto('http://127.0.0.1:3000/myasks?userId='+userId);
    // const content=await page.content()
    // console.log(content)
    await browser.close();
    console.log('visited!')
}
module.exports=new Bot()

