const httpd = require('./ops');
const { spawn} = require('child_process');
const path = require('path');


function getTimeString() {
    return `${ (new Date()).toLocaleString(
        "zh-CN",
        {timeZone: "Asia/Shanghai"}
    ) }: `;
}

let queryProcess = null;
let quering = false;
const doQuery = {
    start: function(req, res) {
        try {
            parseInt(req.query.period);
        } catch (e) {
            res.send(400, 'period is NaN');
        }

        if (quering) {
            res.send(400, 'already running query');
        } else {
            quering = true;
            queryProcess = spawn('node', [
                path.join(__dirname, '../bin/csutil'), 'query',
                '--period', req.query.period
            ], {
                detached: true,
                stdio: ['ignore', 'pipe', 'pipe']
            });

            res.write(`${getTimeString()}查询进程已启动，PID=${queryProcess.pid}。\n`);

            queryProcess.stdout.pipe(res, {end: false});
            queryProcess.stderr.pipe(res, {end: false});

            res.on('end', () => {
                queryProcess.exit(0);
            });
        }
    },

    stop: function(req, res) {
        if (quering) {
            queryProcess.kill('SIGINT');
            quering = false;
            res.send(`${getTimeString()}查询进程结束。\n`);
        } else {
            res.send(400, 'query process nut running');
        }
    }
};


httpd.get('/query', (req, res) => {
    switch (req.query.cmd) {
        case 'start':
            doQuery.start(req, res);
            break;
        case 'stop':
            doQuery.stop(req, res);
            break;
        default:
            res.send(400, 'bad command');
            break;
    }
});

module.exports = httpd;