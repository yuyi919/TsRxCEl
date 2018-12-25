import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';
import { getClientEnvironment, IEvnConfig } from './env';
import paths from './paths';
import { getModuleRules } from './utils/getModuleRules';
import { getOptimizationConfig } from "./utils/getOptimizationConfig";

export const manifest = require('../devlib/lib_manifest.json');


export const publicPath = '/';
export const publicUrl = '';
export const env: IEvnConfig = getClientEnvironment(publicUrl);

export interface ICommonConfig {
  shouldUseSourceMap?: boolean;
  shouldUseRelativeAssetPaths?: boolean;
  isDevelopment?: boolean;
}

export default (config: ICommonConfig) => ({
  target: 'electron-renderer',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    index: [
      require.resolve('./polyfills'),
      paths.appIndexJs
    ]
  },
  output: {
    filename: '[name]/index.js',
    publicPath
  },
  optimization: getOptimizationConfig({
    shouldUseSourceMap: config.shouldUseSourceMap || false
  }, config.isDevelopment || false),
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: ['.mjs', '.web.ts', '.ts', '.web.tsx', '.tsx', '.web.js', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
    },
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      new TsconfigPathsPlugin({ configFile: paths.appTsConfig }),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: getModuleRules({
      shouldUseRelativeAssetPaths: config.shouldUseRelativeAssetPaths || false,
      shouldUseSourceMap: config.shouldUseSourceMap || false,
    }, config.isDevelopment || false)
  },
  plugins: [
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    new ModuleNotFoundPlugin(paths.appPath),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: false,
  },
});
