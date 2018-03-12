const fs = require('fs');
const argv = require('yargs').argv;
const os = require('os');

function init() {
    if (argv.h) {
        console.log('用法：csutil init');
    } else {
        const config = {
            userName: '',
            password: '',
            courseList: []
        };

        fs.writeFileSync(`${os.homedir()}/.csutilrc`, JSON.stringify(config));
    }
}

module.exports = init;