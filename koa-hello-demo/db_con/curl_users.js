const db = require('./db_public/init_table');
const User = db.User;
var login = async function (account,password) {
    var result = await User.findOne({
        'where':{
            'u_account':account,
            'u_password':password
        }
    })
    var ans =await result===null?{
        "RetSucceed":true,
        "Succeed":true,
        "Code":-1,
        "Desc":"失败",
        "Mseeage":'登录失败!',
        "extData":result
    }:{
        "RetSucceed":true,
        "Succeed":true,
        "Code":0,
        "Desc":"成功",
        "Mseeage":'登录成功!',
        "extData":result
    }
    return ans;
}
module.exports = {
    login,

}