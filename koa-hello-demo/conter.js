const fs = require("fs");
const router = require('koa-router')();
var go = function () {
    let pre = __dirname + '/controllers/';
    let file = fs.readdirSync(pre);
    var js_files = file.filter(
        (f) => {
            return f.endsWith('.js');
        }
    )
    for (let i of js_files) {
        let text_file = require(pre + i);
        // console.log('www');
        for (let url in text_file) {
            // console.log(url);
            let path = url.substring(5);
            let func = text_file[url];
            if (url.startsWith("get")) {
                router.get(path, func);
            }
            else if (url.startsWith("post ")) {
                router.post(path, func);
            }
            else
                console.log("con.js！接口读取错误！");
        }
    }
    return router;
}
module.exports = go();