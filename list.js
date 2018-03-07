const fs = require('fs');
const argv = require('yargs').argv;

function list() {
    if (argv.h) {
        console.log('用法：csutil list');
    } else {
        let config;
        try {
            config = JSON.parse(fs.readFileSync('./.config'));
        } catch (e) {
            console.log('错误：需要初始化');
            return;
        }
        for (let course of config.courseList) {
            console.log(`${config.courseList.indexOf(course) + 1}. 开课单位：${course.dept}    课程代码：${course.code}`);
        }
    }
}

module.exports = list;