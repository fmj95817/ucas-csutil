const httpd = require('./rc');
const bodyParser = require('body-parser');
const { spawn} = require('child_process');
const path = require('path');

const jsonParser = bodyParser.json();

httpd.post('/login', jsonParser, (req, res) => {
    const configProcess = spawn('node', [
        path.join(__dirname, '../bin/csutil'), 'config',
        '--username', req.body.userName,
        '--password', req.body.password
    ], {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    configProcess.stdout.pipe(res, {end: false});
    configProcess.stderr.pipe(res, {end: false});
    configProcess.on('close', (code) => {
        const loginProcess = spawn('node', [
            path.join(__dirname, '../bin/csutil'), 'login'
        ], {
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });
        loginProcess.stdout.pipe(res, {end: false});
        loginProcess.stderr.pipe(res, {end: false});
        loginProcess.on('close', (code) => {
            res.end();
        });
    });
});

module.exports = httpd;