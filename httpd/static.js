const express = require('express');
const path = require('path');

const httpd = express();
httpd.use('/', express.static(path.join(__dirname, '../client/www')));

module.exports = httpd;