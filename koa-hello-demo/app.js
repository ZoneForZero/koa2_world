const Koa = require('koa');
const session = require('koa-session');
const conter = require('./con');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
app.use(conter.routes()).use(conter.allowedMethods());


// s

app.listen(8080);
