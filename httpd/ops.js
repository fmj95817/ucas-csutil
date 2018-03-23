const httpd = require('./login');
const bodyParser = require('body-parser');
const { spawn} = require('child_process');
const path = require('path');

const jsonParser = bodyParser.json();

const doCmds = {
    add: function(req, res) {
        const addProcess = spawn('node', [
            path.join(__dirname, '../bin/csutil'), 'add',
            '--dept', req.body.dept,
            '--code', req.body.code
        ], {
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        addProcess.stdout.pipe(res, {end: false});
        addProcess.stderr.pipe(res, {end: false});
        addProcess.on('close', (code) => {
            res.end();
        });
    },

    modify: function(req, res) {
        const removeProcess = spawn('node', [
            path.join(__dirname, '../bin/csutil'), 'remove',
            '--code', req.body.lastCode
        ], {
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        removeProcess.stdout.pipe(res, {end: false});
        removeProcess.stderr.pipe(res, {end: false});
        removeProcess.on('close', (code) => {
            const addProcess = spawn('node', [
                path.join(__dirname, '../bin/csutil'), 'add',
                '--dept', req.body.dept,
                '--code', req.body.code
            ], {
                detached: true,
                stdio: ['ignore', 'pipe', 'pipe']
            });

            addProcess.stdout.pipe(res, {end: false});
            addProcess.stderr.pipe(res, {end: false});
            addProcess.on('close', (code) => {
                res.end();
            });
        });
    },

    remove: function(req, res) {
        const removeProcess = spawn('node', [
            path.join(__dirname, '../bin/csutil'), 'remove',
            '--code', req.body.code
        ], {
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        removeProcess.stdout.pipe(res, {end: false});
        removeProcess.stderr.pipe(res, {end: false});
        removeProcess.on('close', (code) => {
            res.end();
        });
    }
};


httpd.post('/ops', jsonParser, (req, res) => {
    switch (req.query.cmd) {
        case 'add':
            doCmds.add(req, res);
            break;
        case 'modify':
            doCmds.modify(req, res);
            break;
        case 'remove':
            doCmds.remove(req, res);
            break;
        default:
            res.send(400, 'Bad operation command');
            break;
    }
});



module.exports = httpd;

