const ts = require('ts-node');
const paths = require('../config/paths');
const path = require('path');

ts.register({
    project: paths.appTsMainConfig,
    typeCheck: false,
    transpileOnly: true,
    pretty: false
});
