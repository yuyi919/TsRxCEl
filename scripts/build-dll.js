const webpack = require('webpack');
const path = require('path');
const paths = require('../config/paths');
const package = require('../package.json');
const AssetsPlugin = require('assets-webpack-plugin');
// const vendors = [
//     'react',
//     'react-dom',
//     'react-router',
//     'echarts',
//     '@material-ui/core',
//     '@material-ui/icons'
// ];
// const map = {}
// vendors.forEach(value=>{
//     map[value.replace(/[\-\@\/]/ig,'_')] = [require.resolve(value)];
// })
 
module.exports = {
    mode: 'development',
    target: 'web',
    output: {
        path: paths.devlib,
        filename: 'lib.dll.js',
        library: 'lib'
    },
    entry: {
        // lib: vendors,
        lib: Object.keys(package.dependencies)
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(paths.devlib, 'lib_manifest.json'),
            name: 'lib',
            context: __dirname,
        }),
        new AssetsPlugin({
          filename: 'bundle-config.json',
          path: './'
        })
    ],
};