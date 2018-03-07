const fs = require('fs');
const argv = require('yargs').argv;

function init() {
    if (argv.h) {
        console.log('用法：csutil init');
    } else {
        const config = {
            userName: '',
            password: '',
            courseList: []
        };

        fs.writeFileSync('./.config', JSON.stringify(config));
    }
}

module.exports = init;