var User = require('../db_con/curl_users');
var index = async (ctx, next) => {
    ctx.cookies.set('name', 'dy1', {
        domain: 'localhost',
        path: '/',   //cookie写入的路径
        // maxAge: 1000 * 60 * 60 * 1,
        expires: new Date('2020-07-06'),
        httpOnly: false,
        secure: false,
        overwrite: true
    });
    // 我们前面登录时存了ctx.seesion.user这个值
    // 所以可以校验，ctx.session.user不存在则跳转到登录页面
    console.log('a', ctx.headers);
    console.log('a', ctx.headers.cookie);
    // if (!ctx.session.user) {
    //     // console.log('session1:', ctx.session);
    //     ctx.response.redirect('/login');
    // }
    // else {
    // console.log('session2:', ctx.session);
    ctx.response.body = `<h1>Welcome, !</h1>`;

    // }
    // 已登录，则继续渲染页面
};

var login = async (ctx, next) => {
    ctx.cookies.set('name', 'dy1', {
        domain: 'localhost',
        path: '/',   //cookie写入的路径
        // maxAge: 1000 * 60 * 60 * 1,
        expires: new Date('2020-07-06'),
        httpOnly: false,
        secure: false,
        overwrite: true
    });
    console.log('a', ctx.headers);
    console.log('a', ctx.headers.cookie);

    ctx.response.body = `
    <h1>Index</h1>
    <form action="/login_result" method="post">
        <p>Name: <input name="name" value="koa"></p>
        <p>Password: <input name="password" type="password"></p>
        <p><input type="submit" value="Submit"></p>
    </form>`;
}

var login_result = async (ctx, next) => {
    console.log('a', ctx.headers);
    console.log('a', ctx.headers.cookie);
    ctx.cookies.set('name', 'dy1', {
        domain: 'localhost',
        path: '/',   //cookie写入的路径
        // maxAge: 1000 * 60 * 60 * 1,
        expires: new Date('2020-07-06'),
        httpOnly: false,
        secure: false,
        overwrite: true
    });

    var
        account = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    var ans = await User.login(account, password);

    if (ans.Code === 0) {

        // ctx.session.username = account;//把帐号写进session
        ctx.response.body = `<h1>Welcome, ${ans.extData.u_name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/login">Try again</a></p>`;
    }
}

//下面要指明get  post
module.exports = {
    'get  /login': login,
    'post /login_result': login_result,
    'get /': index
}