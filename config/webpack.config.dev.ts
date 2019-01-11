import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import webpack from 'webpack';
import merge from 'webpack-merge';
import paths from './paths';
import Common, { env } from './webpack.config.common';

const manifest = require('../devlib/lib_manifest.json');


export default merge(Common({
  shouldUseSourceMap: true,
  isDevelopment: true
}), {
  mode: "development",
  entry: {
    index: [
      require.resolve('react-hot-loader/patch'),
      require.resolve('webpack-dev-server/client'),
      // require.resolve('webpack/hot/dev-server'),
      // require.resolve('react-dev-utils/webpackHotDevClient'),
    ]
  },
  output: {
    pathinfo: true,
    devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: paths.appHtml,
    }),
    // dll
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest
    }),
    // html导入dll
    new AddAssetHtmlPlugin({ filepath: path.join(__dirname, '../devlib/lib.dll.js'), includeRelatedFiles: true }),
    // 确定模块名
    new webpack.NamedModulesPlugin(),
    // 模块热替换
    new webpack.HotModuleReplacementPlugin(),
    // 
    new CaseSensitivePathsPlugin(),
    //
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ]
});
