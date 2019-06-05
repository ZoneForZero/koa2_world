this is a simple training lib which copy from: https://github.com/tb01923/koa-mysql-session
and update to use async / await

#### example:
 
```js
const 
    Koa = require('koa'),
    session = require('koa-session')
    MysqlStore = require('koa2-mysql-session'),
    app = new Koa()
    
mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'demo'
}

app.use(session({store: new MysqlStore(mysqlConfig)}, app))
```



