const ts = require('ts-node');
const paths = require('../config/paths');
const path = require('path');

const child_process = require('child_process');
const child = child_process.fork('scripts/start-electron.js', { env: process.env, stdio: 'inherit' })
    .on('message', msg => console.log(msg))
    .on('close', code => process.exit(code))
    .on('error', spawnError => console.error(spawnError));
ts.register({
    project: paths.appTsMainConfig,
    typeCheck: false,
    transpileOnly: true
});
console.log(path.join(paths.appSrc, "global"))
