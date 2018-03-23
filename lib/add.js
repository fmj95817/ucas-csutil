const argv = require('yargs').argv;
const fs = require('fs');
const paths = require('../config/paths');

function getTimeString() {
    return `${ (new Date()).toLocaleString(
        "zh-CN",
        {timeZone: "Asia/Shanghai"}
    ) }: `;
}



function add() {
    if (argv.h) {
        console.log('用法：csutil add --dept=开课单位代码 --code=课程代码');
    } else {
        let config;
        try {
            config = JSON.parse(fs.readFileSync(paths.cs.rc));
        } catch (e) {
            console.log('错误：需要初始化');
            return;
        }
        if (argv.dept) {
            if (argv.dept === true) {
                console.log('用法：csutil add --dept=开课单位代码 --code=课程代码');
            } else if (argv.code) {
                if (argv.code === true) {
                    console.log('用法：csutil add --dept=开课单位代码 --code=课程代码');
                } else {
                    let code = argv.code;
                    let list = config.courseList.map(ele => ele.code);
                    let index = list.indexOf(code);

                    if (index < 0) {
                        config.courseList.push({
                            dept: argv.dept,
                            code: argv.code
                        });
                        console.log(`${getTimeString()}代码为${argv.code}的课程已添加。`);
                    } else {
                        config.courseList[index].dept = parseInt(argv.dept);
                        console.log(`${getTimeString()}代码为${argv.code}的课程已修改。`);
                    }
                    fs.writeFileSync(paths.cs.rc, JSON.stringify(config));

                }
            } else {
                console.log('用法：csutil add --dept=开课单位代码 --code=课程代码');
            }
        } else {
            console.log('用法：csutil add --dept=开课单位代码 --code=课程代码');
        }
    }
}

module.exports = add;