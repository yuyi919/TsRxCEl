const paths = require('../paths');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getModuleRules = ({ shouldUseSourceMap = false, shouldUseRelativeAssetPaths = false}, isProd ) => {
  
  const loadKey = isProd? 'loader':'use';

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
        isProd ? ({
          loader: MiniCssExtractPlugin.loader,
          options: Object.assign({}, shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined),
        }) : require.resolve('style-loader') ,
        {
          loader: require.resolve('css-loader'),
          options: cssOptions,
        },
        {
          // Options for PostCSS as we reference these options twice
          // Adds vendor prefixing based on your specified browser support in
          // package.json
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
            ],
            sourceMap: shouldUseSourceMap,
          },
        },
    ];
    if (preProcessor) {
      loaders.push(isProd?({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: shouldUseSourceMap,
        },
      }): require.resolve(preProcessor) );
    }
    return loaders;
  };

  return ([
    // Disable require.ensure as it's not a standard language feature.
    { parser: { requireEnsure: false } },

    // First, run the linter.
    // It's important to do this before Babel processes the JS.
    // TODO: Disable require.ensure as it's not a standard language feature.
    // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
    // { parser: { requireEnsure: false } },
    {
      test: /\.(js|jsx|mjs)$/,
      enforce: 'pre',
      use: [
        {
          options: {
            formatter: require.resolve('react-dev-utils/eslintFormatter'),
            eslintPath: require.resolve('eslint'),
          },
          loader: require.resolve('eslint-loader'),
        },
      ],
      include: paths.appSrc,
    },
    {
      // "oneOf" will traverse all following loaders until one will
      // match the requirements. When no loader matches it will fall
      // back to the "file" loader at the end of the loader list.
      oneOf: [
        // "url" loader works just like "file" loader but it also embeds
        // assets smaller than specified size as data URLs to avoid requests.
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'main/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(js|jsx|mjs)$/,
          include: paths.appSrc,
          loader: require.resolve('babel-loader'),
          options: Object.assign({
            customize: require.resolve('babel-preset-react-app/webpack-overrides'),
            "presets": [
                ['es2015', {modules: false}]
            ],
            plugins: [
              [
                require.resolve('babel-plugin-named-asset-import'),
                {
                  loaderMap: {
                    svg: {
                      ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                    },
                  },
                },
              ],
            ],
            cacheDirectory: true,
          }, isProd?({
              // Save disk space when time isn't as important
              cacheCompression: true,
              compact: true,
              exclude: "/node_modules/",
          }):({
              // Don't waste time on Gzipping the cache
              cacheCompression: false,
          })),
        },
        // Compile .tsx?
        {
          test: /\.(ts|tsx)$/,
          include: paths.appSrc,
          [loadKey]: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
                reportFiles:true,
                configFile: paths.appTsConfig,
                resolveModuleName: true,
                // compilerOptions: {
                //   declaration: true,
                //   declarationDir: ".",
                // }
              },
            },
          ],
        },
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // `MiniCSSExtractPlugin` extracts styles into CSS
        // files. If you use code splitting, async bundles will have their own separate CSS chunk file.
        // By default we support CSS Modules with the extension .module.css
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          [loadKey]: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isProd?shouldUseSourceMap:undefined,
          }),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: isProd,
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: cssModuleRegex,
          [loadKey]: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isProd?shouldUseSourceMap:undefined,
            modules: true,
            getLocalIdent: getCSSModuleLocalIdent,
          }),
        },
        // Opt-in support for SASS. The logic here is somewhat similar
        // as in the CSS routine, except that "sass-loader" runs first
        // to compile SASS files into CSS.
        // By default we support SASS Modules with the
        // extensions .module.scss or .module.sass
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          [loadKey]: getStyleLoaders({
            importLoaders: 2,
            sourceMap: isProd?shouldUseSourceMap:undefined,
          }, 'sass-loader'),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        // Adds support for CSS Modules, but using SASS
        // using the extension .module.scss or .module.sass
        {
          test: sassModuleRegex,
          [loadKey]: getStyleLoaders({
            importLoaders: 2,
            sourceMap: isProd?shouldUseSourceMap:undefined,
            modules: true,
            getLocalIdent: getCSSModuleLocalIdent,
          }, 'sass-loader'),
        },
        // "file" loader makes sure assets end up in the `build` folder.
        // When you `import` an asset, you get its filename.
        // This loader doesn't use a "test" so it will catch all modules
        // that fall through the other loaders.
        {
          loader: require.resolve('file-loader'),
          // Exclude `js` files to keep "css" loader working as it injects
          // it's runtime that would otherwise processed through "file" loader.
          // Also exclude `html` and `json` extensions so they get processed
          // by webpacks internal loaders.
          exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
          options: {
            name: 'static/assent/[name].[hash:8].[ext]',
          },
        },
      ],
    },
  ])
};

exports.getModuleRules = getModuleRules;