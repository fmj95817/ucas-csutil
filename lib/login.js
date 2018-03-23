const querystring = require('querystring');
const http = require('http');
const fs = require('fs');
const argv = require('yargs').argv;
const paths = require('../config/paths.js').cs;


function getTimeString() {
    return `${ (new Date()).toLocaleString(
        "zh-CN",
        {timeZone: "Asia/Shanghai"}
    ) }: `.split(' ')[1] + ' ';
}

function getLoginPagePromise() {
    return new Promise(
        (resolve, reject) => {
            const req = http.request({
                host: 'sep.ucas.ac.cn',
                port: 80,
                path: '/',
                method: 'GET'
            }, (res) => {
                res.setEncoding('utf8');

                let cookie = res.headers['set-cookie'];
                let jsessionid = cookie[0].split(';')[0];

                resolve(jsessionid);
                console.log(getTimeString() + '获取Sep登录页面成功。');
            });

            req.on('error', (e) => {
                reject(getTimeString() + `请求Sep登录页面失败: ${e.message}`);
            });

            req.end();
        }
    );
}


function loginSepPromise(userName, password, jsessionid) {
    return new Promise(
        (resolve, reject) => {
            const uinfo = querystring.stringify({
                'userName': userName,
                'sb': 'sb',
                'pwd': password
            });

            const loginOptions = {
                hostname: 'sep.ucas.ac.cn',
                port: 80,
                path: '/slogin',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(uinfo),
                    'Cookie': jsessionid
                }
            };

            const req = http.request(loginOptions, (res) => {
                res.setEncoding('utf8');
                if (res.headers['location'] == 'http://sep.ucas.ac.cn/') {
                    reject(getTimeString() + '登录Sep失败: 用户名或密码错误。');
                } else {
                    let cookie = res.headers['set-cookie'];
                    let sepuser = cookie[1].split(';')[0];

                    resolve({
                        jsessionid: jsessionid,
                        sepuser: sepuser
                    });

                    console.log(getTimeString() + '登录Sep成功。');
                }
            });

            req.on('error', (e) => {
                reject(getTimeString() + `登录Sep失败: ${e.message}。`)
            });

            // write data to request body
            req.write(uinfo);
            req.end();
        }
    );
}




function getAppStorePromise(cookie) {
    return new Promise(
        (resolve, reject) => {
            const req = http.request({
                host: 'sep.ucas.ac.cn',
                port: 80,
                path: '/appStore',
                method: 'GET',
                headers: {
                    'Cookie': `${cookie.jsessionid};${cookie.sepuser}`
                }
            }, (res) => {
                res.setEncoding('utf8');

                resolve(cookie);
                console.log(getTimeString() + '获取appStore页面成功。');
            });

            req.on('error', (e) => {
                reject(getTimeString() + `获取appStore页面失败: ${e.message}。`);
            });

            req.end();
        }
    );
}



function get821PagePromise(cookie) {
    return new Promise(
        (resolve, reject) => {
            const req = http.request({
                host: 'sep.ucas.ac.cn',
                port: 80,
                path: '/portal/site/226/821',
                method: 'GET',
                headers: {
                    'Cookie': `${cookie.jsessionid};${cookie.sepuser}`
                }
            }, (res) => {
                let html = '';

                res.setEncoding('utf8');
                res.on('data', (data) => {
                    html += data;
                });


                res.on('end', () => {
                    let nextPath = html.match(
                        new RegExp("/login\\?Identity=[0-9a-z\-]+\&roleId=[0-9]+", "g")
                    )[0];

                    resolve({
                        cookie: cookie,
                        path: nextPath
                    });
                    console.log(getTimeString() + '获取821页面成功。');
                });
            });

            req.on('error', (e) => {
                reject(getTimeString() + `获取821页面失败: ${e.message}。`);
            });

            req.end();
        }
    );
}


function loginJWPromise(params) {
    return new Promise(
        (resolve, reject) => {
            const req = http.request({
                host: 'jwxk.ucas.ac.cn',
                port: 80,
                path: params.path,
                method: 'GET',
                headers: {
                    'Cookie': params.cookie.sepuser
                }
            }, (res) => {
                res.setEncoding('utf8');

                let cookie = res.headers['set-cookie'];
                let jsessionid = cookie[0].split(';')[0];

                resolve({
                    jsessionid: jsessionid,
                    sepuser: params.cookie.sepuser
                });

                console.log(getTimeString() + '登录教务选课系统成功。');
            });

            req.on('error', (e) => {
                reject(getTimeString() + `登录教务选课系统失败: ${e.message}。`);
            });

            req.end();
        }
    );
}





function getJWMainPagePromise(cookie) {
    return new Promise(
        (resolve, reject) => {
            const req = http.request({
                host: 'jwxk.ucas.ac.cn',
                port: 80,
                path: '/main',
                method: 'GET',
                headers: {
                    'Cookie': `${cookie.jsessionid};${cookie.sepuser}`
                }
            }, (res) => {
                res.setEncoding('utf8');

                resolve(cookie);
                console.log(getTimeString() + '获取选课系统主页成功。');
            });

            req.on('error', (e) => {
                reject(getTimeString() + `获取选课系统主页失败: ${e.message}。`);
            });

            req.end();
        }
    );
}


function getCMMainPagePromise(cookie) {
    return new Promise(
        (resolve, reject) => {
            const req = http.request({
                host: 'jwxk.ucas.ac.cn',
                port: 80,
                path: '/courseManage/main',
                method: 'GET',
                headers: {
                    'Cookie': `${cookie.jsessionid};${cookie.sepuser}`
                }
            }, (res) => {
                let html = '';

                res.setEncoding('utf8');
                res.on('data', (data) => {
                    html += data;
                });

                res.on('end', () => {
                    let nextPath = html.match(
                        new RegExp('/courseManage/selectCourse\\?s=[0-9a-z\-]+', 'g')
                    )[0];

                    resolve({
                        path: nextPath,
                        cookie: cookie
                    });
                    console.log(getTimeString() + '获取课程选择主页成功。');
                });

            });

            req.on('error', (e) => {
                reject(getTimeString() + `获取课程选择主页失败: ${e.message}。`);
            });

            req.end();
        }
    );
}



function login(userName, password, onSuccess, onFail) {
    getLoginPagePromise().then(
        (jsessionid) => {
            return loginSepPromise(userName, password, jsessionid);
        },
        (emsg) => {
            console.log(emsg);
        }
    ).then(
        (cookie) => {
            return getAppStorePromise(cookie);
        },
        (emsg) => {
            console.log(emsg);
            process.exit(1);
        }
    ).then(
        (cookie) => {
            return get821PagePromise(cookie);
        },
        (emsg) => {
            console.log(emsg);
        }
    ).then(
        (params) => {
            return loginJWPromise(params);
        },
        (emsg) => {
            console.log(emsg);
        }
    ).then(
        (cookie) => {
            return getJWMainPagePromise(cookie);
        },
        (emsg) => {
            console.log(emsg);
        }
    ).then(
        (cookie) => {
            return getCMMainPagePromise(cookie);
        },
        (emsg) => {
            console.log(emsg);
        }
    ).then(
        (params) => {
            onSuccess(params);
        },
        (emsg) => {
            onFail(emsg);
        }
    );
}


function loginPromise(userName, password, path) {
    return new Promise(
        (resolve, reject) => {
            login(
                userName, password,
                (params) => {
                    fs.writeFileSync(path, JSON.stringify(params));
                    resolve(params);
                }, reject
            );
        }
    );
}


function loginSync() {
    let config;
    try {
        config = JSON.parse(fs.readFileSync(paths.rc));
    } catch (e) {
        console.log('错误：需要初始化');
        return;
    }
    if (argv.h) {
        console.log('用法：csutil login');
    } else {
        if (config.userName) {
            loginPromise(config.userName, config.password, paths.session).then(
                (params) => {
                    console.log(getTimeString() + '登录成功。 ');
                    console.log(getTimeString() + 'JSESSIONID, sepuser和选课URL已保存。');
                },
                (emsg) => {
                    console.log(emsg);
                }
            );
        } else {
            console.log(getTimeString() + '错误：用户名或密码未设置');
        }
    }
}

module.exports = loginSync;