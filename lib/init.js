const fs = require('fs');
const argv = require('yargs').argv;
const paths = require('../config/paths');

function init() {
    if (argv.h) {
        console.log('用法：csutil init');
    } else {
        const config = {
            userName: '',
            password: '',
            courseList: []
        };

        fs.writeFileSync(paths.cs.rc, JSON.stringify(config));
    }
}

module.exports = init;