const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const {
    TerserPluginConfig
} = require("../config/utils/TerserPluginConfig");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const paths = require('../config/paths');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const ClearWebpackPlugin = require('clean-webpack-plugin');

// Ensure environment variables are read.
process.env.NODE_ENV = 'production';
require('../config/env');

module.exports = {
    // mode: 'development',
    mode: 'production',
    target: 'electron-renderer',
    entry: [paths.appMainTs],
    // devtool: 'cheap-module-source-map',
    output: {
        path: paths.appBuild,
        filename: 'main/index.js',
        publicPath: '',
        // library: 'MainLibrary',
        libraryTarget: 'commonjs2',
        globalObject: 'this',
        // umdNamedDefine: true
    },
    module: {
        strictExportPresence: true,
        rules: [{
                test: /\.(ts|tsx)$/,
                include: paths.appSrc,
                use: [{
                    loader: require.resolve('ts-loader'),
                    options: {
                        transpileOnly: true,
                        configFile: paths.appTsMainConfig,
                    },
                }, ],
            },
            {
                test: /node_modules[\/\\](iconv-lite)[\/\\].+/,
                resolve: {
                    aliasFields: ['main']
                }
            }
        ]
    },
    resolve: {
        modules: ['node_modules', paths.appNodeModules].concat(
            // It is guaranteed to exist because we tweak it in `env.js`
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),
        extensions: [
            '.ts',
            '.js',
            '.json',
        ],
        plugins: [
            PnpWebpackPlugin,
            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
            new TsconfigPathsPlugin({
                configFile: paths.appTsMainConfig
            }),
        ],
    },
    optimization: {
        minimizer: [
            new TerserPlugin(TerserPluginConfig({
                shouldUseSourceMap: false
            }))
        ]
    },
    resolveLoader: {
        plugins: [
            // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
            // from the current package.
            PnpWebpackPlugin.moduleLoader(module),
        ],
    },
    plugins: [
        new ClearWebpackPlugin([paths.appBuildMain], {
            root: paths.appBuild,
            verbose: true
        }),
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: manifest
        // }),
        // new webpack.DllPlugin({
        //     path: path.join(paths.appBuild, 'main-lib/manifest.json'),
        //     name: 'MainLibrary',
        //     context: __dirname,
        // }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            tsconfig: paths.appTsMainConfig,
            tslint: paths.appTsLint,
        }),
    ], // // Some libraries import Node modules but don't use them in the browser.
    // // Tell Webpack to provide empty mocks for them so importing them works.
    // node: {
    //     dgram: 'empty',
    //     fs: 'empty',
    //     net: 'empty',
    //     tls: 'empty',
    //     child_process: 'empty',
    // },
};

if (process.env.ONLY == 'true') {
    module.exports.plugins.push(new BundleAnalyzerPlugin());
}