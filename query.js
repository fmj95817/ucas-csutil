const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');
const argv = require('yargs').argv;
const os = require('os');


function getCourseInfoPromise(params, courses) {
    return new Promise(
        (resolve, reject) => {
            let dpts = new Set(courses.map(ele => ele.dept));
            let dptInfo = '';
            for (let dptId of dpts) {
                dptInfo += `deptIds=${dptId}&`;
            }
            dptInfo += 'sb=0';

            const options = {
                hostname: 'jwxk.ucas.ac.cn',
                port: 80,
                path: params.path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(dptInfo),
                    'Cookie': `${params.cookie.jsessionid};${params.cookie.sepuser}`
                },
                encoding: 'utf8'
            };

            const req = http.request(options, (res) => {
                let html = '';

                res.setEncoding('utf8');
                res.on('data', (data) => {
                    html += data;
                });

                res.on('end', () => {
                    $ = cheerio.load(html, { decodeEntities: false });
                    let regPath = $('#regfrm').attr('action');

                    let coursesInfo = [];
                    for (let course of courses) {
                        let courseNode = $(`span:contains('${course.code}')`);
                        let tableItem = courseNode.parent().parent().parent();
                        let courseId = courseNode.attr('id').split('_')[1];
                        let courseName = tableItem.children().eq(3).children().html();
                        let limit = tableItem.children().eq(6).html();
                        let current = tableItem.children().eq(7).html();
                        let available = !Boolean(tableItem.children().eq(0).children().attr('disabled'));

                        coursesInfo.push({
                            courseName: courseName,
                            courseDept: course.dept,
                            courseCode: course.code,
                            courseId: courseId,
                            limit: parseInt(limit),
                            current: parseInt(current),
                            available: available
                        });
                    }

                    resolve({
                        cookie: params.cookie,
                        regPath: regPath,
                        coursesInfo: coursesInfo
                    });
                    let courseNamesList = JSON.stringify(coursesInfo.map(ele => ele.courseName));
                    courseNamesList = courseNamesList.substr(1, courseNamesList.length - 2);

                    console.log(`${ (new Date()).toLocaleString(
                        "zh-CN",
                        { timeZone: "Asia/Shanghai"}
                    ) }: 获取课程${courseNamesList}选课信息成功。`);
                });
            });

            req.on('error', (e) => {
                reject(`Problem get course information: ${e.message}`);
            });

            // write data to request body
            req.write(dptInfo);
            req.end();
        }
    );
}



function regCoursePromise(cookie, regPath, course) {
    return new Promise(
        (resolve, reject) => {
            let regInfo = `deptIds=${course.courseDept}&sids=${course.courseId}`;

            const options = {
                hostname: 'jwxk.ucas.ac.cn',
                port: 80,
                path: regPath,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(regInfo),
                    'Cookie': `${cookie.sepuser};${cookie.jsessionid}`
                },
                encoding: 'utf8'
            };

            const req = http.request(options, (res) => {
                let html = '';

                res.setEncoding('utf8');
                res.on('data', (data) => {
                    html += data;
                });

                res.on('end', () => {
                    if (html) {
                        $ = cheerio.load(html, { decodeEntities: false });
                        let regPath = $('#regfrm').attr('action');

                        reject({
                            msg: `课程"${course.courseName}"选课失败：${$('#loginError').html()}`,
                            regPath: regPath
                        });
                    } else {
                        resolve({
                            courseCode: course.courseCode,
                            msg: `课程"${course.courseName}"选课成功`,
                            regPath: regPath
                        });
                    }
                });
            });

            req.on('error', (e) => {
                reject(`Problem register course: ${e.message}`);
            });

            // write data to request body
            req.write(regInfo);
            req.end();
        }
    );
}



function query(path, courses, period) {
    const params = JSON.parse(fs.readFileSync(path));
    let cycle = setInterval(
        () => {
            if (courses.length) {
                getCourseInfoPromise(params, courses).then(
                    (params) => {
                        for (let course of params.coursesInfo) {
                            let len = params.coursesInfo.length;
                            let index = params.coursesInfo.indexOf(course) + 1;
                            console.log(`课程${index}：课程名称：${course.courseName}`);
                            console.log(`       课程代码：${course.courseCode}`);
                            console.log(`       开课单位：${course.courseDept}`);
                            console.log(`       限选：${course.limit} 人`);
                            console.log(`       当前：${course.current} 人`);
                            console.log(`       可选：${course.available ? '是' : '否'}${index < len ? '\n' : ''}`);
                        }

                        let regableList = [];
                        for (let course of params.coursesInfo) {
                            if (course.available) {
                                regableList.push(course);
                            }
                        }
                        if (regableList.length) {
                            for (let course of regableList) {
                                regCoursePromise(params.cookie, params.regPath, course).then(
                                    (successParams) => {
                                        console.log(`${ (new Date()).toLocaleString(
                                            "zh-CN",
                                            {timeZone: "Asia/Shanghai"}
                                        ) }: ${successParams.msg}\n`);
                                        let config = JSON.parse(fs.readFileSync(`${os.homedir()}/.config`));
                                        let index = config.courseList.map(ele => ele.code).indexOf(successParams.courseCode);
                                        courses.splice(courses.map(ele => ele.courseCode).indexOf(successParams.courseCode), 1);
                                        config.courseList.splice(index, 1);
                                        fs.writeFileSync(`${os.homedir()}/.config`, JSON.stringify(config));
                                    },
                                    (failParams) => {
                                        console.log(`${ (new Date()).toLocaleString(
                                            "zh-CN",
                                            {timeZone: "Asia/Shanghai"}
                                        ) }: ${failParams.msg}\n`);
                                    }
                                );
                            }
                        } else {
                            console.log(`${ (new Date()).toLocaleString(
                                "zh-CN",
                                {timeZone: "Asia/Shanghai"}
                            ) }: 暂无可选课程。\n`);
                        }

                    }
                );
            } else {
                clearInterval(cycle);
                console.log("已经没有需要选择的课程，程序结束。")
            }
        }, period * 1000
    );

}


function querySync() {
    let config;
    try {
        config = JSON.parse(fs.readFileSync(`${os.homedir()}/.config`));
    } catch (e) {
        console.log('错误：需要初始化');
        return;
    }

    if (argv.h) {
        console.log('用法：csutil query');
    } else {
        if (config.courseList.length) {
            query(`${os.homedir()}/.params`, config.courseList, 1800);
        } else {
            console.log('错误：未添加课程');
        }
    }
}

module.exports = querySync;