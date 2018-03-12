const argv = require('yargs').argv;
const fs = require('fs');

function remove() {
    if (argv.h) {
        console.log('用法：csutil remove --code=课程代码');
    } else {
        let config;
        try {
            config = JSON.parse(fs.readFileSync(`${os.homedir()}/.config`));
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
                    fs.writeFileSync(`${os.homedir()}/.config`, JSON.stringify(config));
                    console.log(`代码为${argv.code}的课程已删除`);
                } else {
                    console.log(`代码为${argv.code}的课程未添加`);
                }
            }
        } else {
            console.log('用法：csutil remove --code=课程代码');
        }
    }
}

module.exports = remove;