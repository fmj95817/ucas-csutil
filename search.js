const argv = require('yargs').argv;
const fs = require('fs');

function search() {
    if (argv.h) {
        console.log('用法：csutil search --keyword=开课单位模糊名称');
    } else {
        if (argv.keyword) {
            if (argv.keyword === true) {
                console.log('错误：缺少搜索关键字');
            } else {
                const database = JSON.parse(fs.readFileSync('./.dept'));
                for (let dept of database) {
                    if (dept.name.indexOf(argv.keyword) >= 0) {
                        console.log(`开课单位：${dept.name}    代码：${dept.dept}`);
                    }
                }
            }
        } else {
            console.log('用法：csutil search --keyword=开课单位模糊名称');
        }
    }
}

module.exports = search;