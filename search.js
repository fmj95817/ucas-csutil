const argv = require('yargs').argv;

const database = [
    { "dept": "910", "name": "数学学院" },
    { "dept": "911", "name": "物理学院" },
    { "dept": "957", "name": "天文学院" },
    { "dept": "912", "name": "化学学院" },
    { "dept": "928", "name": "材料学院" },
    { "dept": "913", "name": "生命学院" },
    { "dept": "914", "name": "地球学院" },
    { "dept": "921", "name": "资环学院" },
    { "dept": "951", "name": "计算机学院" },
    { "dept": "952", "name": "电子学院" },
    { "dept": "958", "name": "工程学院" },
    { "dept": "917", "name": "经管学院" },
    { "dept": "945", "name": "公共管理学院" },
    { "dept": "927", "name": "人文学院" },
    { "dept": "964", "name": "马克思中心" },
    { "dept": "915", "name": "外语系" },
    { "dept": "954", "name": "中丹学院" },
    { "dept": "955", "name": "国际学院" },
    { "dept": "959", "name": "存济医学院" },
    { "dept": "946", "name": "体育教研室" },
    { "dept": "961", "name": "微电子学院" },
    { "dept": "962", "name": "未来技术学院" },
    { "dept": "963", "name": "网络空间安全学院" },
    { "dept": "968", "name": "心理学系" },
    { "dept": "969", "name": "人工智能学院" },
    { "dept": "970", "name": "纳米科学与技术学院" },
    { "dept": "971", "name": "艺术中心" },
    { "dept": "972", "name": "光电学院" },
    { "dept": "967", "name": "创新创业学院" }
];

function search() {
    if (argv.h) {
        console.log('用法：csutil search --keyword=开课单位模糊名称');
    } else {
        if (argv.keyword) {
            if (argv.keyword === true) {
                console.log('错误：缺少搜索关键字');
            } else {
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