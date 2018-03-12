const argv = require('yargs').argv;
const fs = require('fs');
const os = require('os');

function config() {
    if (argv.h) {
        console.log('用法：csutil config [--username=Sep用户名] [--password=Sep密码]');
    } else {
        let config;
        try {
            config = JSON.parse(fs.readFileSync(`${os.homedir()}/.config`));
        } catch (e) {
            console.log('错误：需要初始化');
            return;
        }
        if (argv.username) {
            if (argv.username === true) {
                console.log('错误：未指定用户名');
            } else {
                config.userName = argv.username;
                console.log('用户名已保存');
            }
        }

        if (argv.password) {
            if (argv.password === true) {
                console.log('错误：未指定密码');
            } else {
                config.password = argv.password;
                console.log('密码已保存');
            }
        }

        if ((!argv.username) && (!argv.password)) {
            console.log('用法：csutil config [--username=Sep用户名] [--password=Sep密码]');
        }

        fs.writeFileSync(`${os.homedir()}/.config`, JSON.stringify(config));
    }
}

module.exports = config;