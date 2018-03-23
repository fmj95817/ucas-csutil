const argv = require('yargs').argv;
const fs = require('fs');
const paths = require('../config/paths');


function getTimeString() {
    return `${ (new Date()).toLocaleString(
        "zh-CN",
        {timeZone: "Asia/Shanghai"}
    ) }: `.split(' ')[1] + ' ';
}

function config() {
    if (argv.h) {
        console.log('用法：csutil config [--username=Sep用户名] [--password=Sep密码]');
    } else {
        let config;
        try {
            config = JSON.parse(fs.readFileSync(paths.cs.rc));
        } catch (e) {
            console.log('错误：需要初始化。');
            return;
        }

        if (argv.username === true) {
            console.log('错误：未设置用户名。');
            config.userName = '';
        } else if(argv.username !== undefined) {
            config.userName = argv.username;
            console.log(getTimeString() + '用户名已保存。');
        }

        if (argv.password === true) {
            console.log('错误：未设置密码。');
            config.password = '';
        } else if(argv.password !== undefined) {
            config.password = argv.password;
            console.log(getTimeString() + '密码已保存。');
        }

        if (argv.username === undefined && argv.password === undefined) {
            console.log('用法：csutil config [--username=Sep用户名] [--password=Sep密码]');
        }

        fs.writeFileSync(paths.cs.rc, JSON.stringify(config));
        console.log(getTimeString() + '用户信息配置完成。');
    }
}

module.exports = config;