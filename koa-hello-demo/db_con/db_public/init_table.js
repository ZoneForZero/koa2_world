const db_pool = require('./get_pool');
const sequelize = require('sequelize');
const {
    STRING,
    INTEGER,
    BIGINT,
    TEXT
} = sequelize;
const User = db_pool.define(
    'tbl_users',
    {
        u_id: {
            type: INTEGER(10),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        u_account: {
            type: STRING(32),
            allowNull: false,
            unique: true
        },
        u_password: {
            type: STRING(32),
            allowNull: false,
        },
        u_name: {
            type: STRING(32),
            allowNull: false,
        },
    }, {
        conmit: '账号表',
        indexes: [
            {
                name: 'index_account',
                unique: true,
                fields: ['u_account']
            },
        ]
    }
)
const Posts = db_pool.define(
    'tbl_posts',
    {
        p_id: {
            type: INTEGER(10),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        p_user: {
            type: INTEGER(10),
            allowNull: false,
            unique: true
        },
        p_title: {
            type: INTEGER(10),
            allowNull: false,
        },
        p_content: {
            type: TEXT,
            allowNull: false,
        },
    }, {
        conmit: '帖子表',
        indexes: [
            {
                name: 'index_user_id',
                unique: true,
                fields: ['p_user']
            },
        ]
    }
)
const createTable = async () => {
    console.log('重建数据表！');
    await User.sync({
        force: false,
    })
    await Posts.sync({
        force: false,
    })
    await User.create({
        'u_account': 'hjh',
        'u_password': '952696403',
        'u_name': 'Zero'
    })
}
module.exports = {
    User,
    Posts,
    createTable
}