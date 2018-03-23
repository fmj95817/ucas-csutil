const argv = require('yargs').argv;
const fs = require('fs');
const paths = require('../config/paths');

function getTimeString() {
    return `${ (new Date()).toLocaleString(
        "zh-CN",
        {timeZone: "Asia/Shanghai"}
    ) }: `;
}


function remove() {
    if (argv.h) {
        console.log('用法：csutil remove --code=课程代码');
    } else {
        let config;
        try {
            config = JSON.parse(fs.readFileSync(paths.cs.rc));
        } catch (e) {
            console.log('错误：需要初始化');
            return;
        }
        if (argv.code) {
            if (argv.code === true) {
                console.log('未指定课程代码');
            } else {
                let index = config.courseList.map(ele => ele.code).indexOf(argv.code);
                if (index >= 0) {
                    config.courseList.splice(index, 1);
                    fs.writeFileSync(paths.cs.rc, JSON.stringify(config));
                    console.log(`${getTimeString()}代码为${argv.code}的课程已删除。`);
                } else {
                    console.log(`${getTimeString()}代码为${argv.code}的课程未添加。`);
                }
            }
        } else {
            console.log('用法：csutil remove --code=课程代码');
        }
    }
}

module.exports = remove;