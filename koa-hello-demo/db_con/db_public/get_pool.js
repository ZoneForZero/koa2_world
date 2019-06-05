//返回连接池
const Sequelize = require('sequelize');
const db_info = require('../../config/db_local');

const sequelize = new Sequelize(
    db_info.database, db_info.user, db_info.password, {
        host: db_info.host,
        dialect: db_info.dialect,
        timezone: '+08:00',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)
sequelize.authenticate().then(
    () => { console.log('连接数据库成功！'); }
).catch(err => { console.log('连接数据库失败！'); })
module.exports = sequelize;
