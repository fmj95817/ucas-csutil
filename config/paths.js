const os = require('os');
const path = require('path');
const fs = require('fs');


const csPaths = {
    rc: `${os.homedir()}/.csutilrc`,
    session: `${os.homedir()}/.csutilsession`
};

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(path.join(__dirname, '..'));
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

const getPublicUrl = appPackageJson =>
    envPublicUrl || require(appPackageJson).homepage;

// config after eject: we're in ./config/
let wpPaths = {
    dotenv: resolveApp('client/.env'),
    appBuild: resolveApp('client/www'),
    appPublic: resolveApp('client/public'),
    appHtml: resolveApp('client/public/index.html'),
    appIndexJs: resolveApp('client/src/index.js'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('client/src'),
    yarnLockFile: resolveApp('yarn.lock'),
    testsSetup: resolveApp('client/src/setupTests.js'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: '/',
};


module.exports = {
    webpack: wpPaths,
    cs: csPaths
};


// @remove-on-eject-begin
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

// config before eject: we're in ./node_modules/react-scripts/config/
wpPaths = {
    dotenv: resolveApp('client/.env'),
    appPath: resolveApp('client/'),
    appBuild: resolveApp('client/www'),
    appPublic: resolveApp('client/public'),
    appHtml: resolveApp('client/public/index.html'),
    appIndexJs: resolveApp('client/src/index.js'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('client/src'),
    yarnLockFile: resolveApp('yarn.lock'),
    testsSetup: resolveApp('client/src/setupTests.js'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: '/',
    // These properties only exist before ejecting:
    ownPath: resolveOwn('client/'),
    ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3
};


module.exports = {
    webpack: wpPaths,
    cs: csPaths
};









