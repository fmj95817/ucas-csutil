const argv = require('yargs').argv;
const fs = require('fs');

function add() {
    if (argv.h) {
        console.log('用法：csutil add --dept=开课单位代码 --code=课程代码');
    } else {
        let config;
        try {
            config = JSON.parse(fs.readFileSync('./config.json'));
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
                    config.courseList.push({
                        dept: argv.dept,
                        code: argv.code
                    });
                    fs.writeFileSync('./config.json', JSON.stringify(config));
                    console.log(`代码为${argv.code}的课程已添加`);
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