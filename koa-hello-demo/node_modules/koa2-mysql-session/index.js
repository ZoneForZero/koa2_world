'use strict';
const mysql = require('mysql2');

const CREATE_STATEMENT = 'CREATE  TABLE IF NOT EXISTS `_mysql_session_store` (`id` VARCHAR(255) NOT NULL, `expires` BIGINT NULL, `data` TEXT NULL, PRIMARY KEY (`id`), KEY `_mysql_session_store__expires` (`expires`));'
  , GET_STATEMENT = 'SELECT * FROM `_mysql_session_store` WHERE id  = ? AND expires > ?'
  , SET_STATEMENT = 'INSERT INTO _mysql_session_store(id, expires, data) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE expires=?, data =?'
  , DELETE_STATEMENT = 'DELETE FROM `_mysql_session_store` WHERE id  = ?'
  , CLEANUP_STATEMENT = 'DELETE FROM `_mysql_session_store` WHERE expires  < ?';

const testSQL = 'SELECT * FROM account limit 1'
const FORTY_FIVE_MINUTES = 45 * 60 * 1000
const FIFTEEN_MINUTES = 15 * 60 * 1000

class MysqlStore {
  /*
   * mysql储存器
   * @params {object} opts
   * @params {string} opts.host, default = localhost
   * @params {string} opts.user, default = root
   * @params {string} opts.password, default = 123456
   * @params {string} opts.database
   */
  constructor(opts) {
    let cleanInternal = !opts.clean ? FIFTEEN_MINUTES : opts.clean

    if (!opts.host) opts.host = 'localhost'
    if (!opts.user) opts.user = 'root'
    if (!opts.password) opts.password = '123456'

    this.opts = opts
    this.connection = mysql.createPool(opts)
    this.query(CREATE_STATEMENT)
    setInterval(this.cleanup.bind(this), cleanInternal)
  }

  async get (sid) {
    let rows = await this.query(GET_STATEMENT, [sid, Date.now()])
    let session = null

    if (rows && rows[0] && rows[0].data) {
      session = JSON.parse(rows[0].data)
    }

    return session
  }

  async set (sid, session, ttl) {
    let expires = getExpiresOn(session, ttl)
    let data = JSON.stringify(session)
    let rows = await this.query(SET_STATEMENT, [sid, expires, data, expires, data])

    return rows
  }

  async destroy (sid) {
    await this.query(DELETE_STATEMENT, [sid])
  }

  async query (sql, fields) {
    if (!this.connection) this.connection = mysql.createPool(this.opts)
    return new Promise((resolve, reject) => {
      this.connection.getConnection((err, connection) => {
        connection.query(sql, fields, (err, rows) => {
          // 释放池连接
          connection.release()
          if (rows) resolve(rows)
          else reject(err)
        })
      })
    })
  }

  async cleanup () {
    let now = new Date().getTime()
    this.query(CLEANUP_STATEMENT, [now])
  }
}

let getExpiresOn = function (session, ttl) {
  let expiresOn = null;
  ttl = ttl || FORTY_FIVE_MINUTES

  if (!session && !session.cookie && session.cookie.expires) return Date.now() + ttl


  session.cookie.expires instanceof Date ?
    expiresOn = session.cookie.expires :
    expiresOn = new Date(session.cookie.expires)

  return expiresOn.valueOf()
}

module.exports = MysqlStore
