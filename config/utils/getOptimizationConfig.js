const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { TerserPluginConfig } = require("./TerserPluginConfig");

const getOptimizationConfig = ({ shouldUseSourceMap }, isProd) => ({
  // runtimeChunk: isProd ? {
  //   name: 'manifest'
  // }: undefined,
  minimizer: isProd ? [
    new TerserPlugin(TerserPluginConfig({ shouldUseSourceMap })),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        parser: safePostCssParser,
        map: shouldUseSourceMap
          ? {
            // `inline: false` forces the sourcemap to be output into a
            // separate file
            inline: false,
            // `annotation: true` appends the sourceMappingURL to the end of
            // the css file, helping the browser find the sourcemap
            annotation: true,
          }
          : false,
      },
    }) // use OptimizeCSSAssetsPlugin 生产
  ] : undefined,
  // Automatically split vendor and commons
  // https://twitter.com/wSokra/status/969633336732905474
  // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
  // splitChunks: isProd? ({
  //   chunks: 'all',
  //   minSize: 30000,
  //   minChunks: 1,
  //   maxInitialRequests: 3,
  //   name: 'vendor',
  //   cacheGroups: {
  //     vendor: {
  //       chunks: 'all',
  //       priority: -10,
  //       reuseExistingChunk: false,
  //       test: /node_modules\/(.*)\.js/
  //     },
  //     styles: {
  //       name: 'styles',
  //       test: /\.(scss|css)$/,
  //       chunks: 'initial',
  //       minChunks: 1,
  //       reuseExistingChunk: true,
  //       enforce: true
  //     },
  //   },
  //   hidePathInfo: true
  // }):
  // ({
  //   chunks: 'all',
  //   name: false,
  // }),
  // Keep the runtime chunk seperated to enable long term caching
  // https://twitter.com/wSokra/status/969679223278505985
  // runtimeChunk: !isProd,
});
exports.getOptimizationConfig = getOptimizationConfig;