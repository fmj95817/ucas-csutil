const httpd = require('./static');
const paths = require('../config/paths');
const fs = require('fs');

httpd.get('/rc', (req, res) => {
    res.send(fs.readFileSync(paths.cs.rc).toString());
});

module.exports = httpd;