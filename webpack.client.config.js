const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const alias = require('./webpack.alias');

const views = ['client'];

module.exports = (env, argv) => {
  const htmlPlugins = views.map(view => (
    new HtmlWebPackPlugin({
      template: './client/index.html',
      filename: './client.html',
      chunks: [view],
    })
  ));

  // Create initial config object with options shared in both development and
  // production environments
  const config = {
    mode: argv.mode || 'development',
    target: 'web',
    context: path.resolve(__dirname, 'src'),
    entry: {
      client: './client/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist/client'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: '/node_modules/',
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: true }
            }
          ]
        },
        {
          test: /\.s?css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              query: {
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            'resolve-url-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              }
            }
          ]
        }
      ]
    },
    resolve: {
      alias,
      extensions: ['.js', '.jsx', '.json'],
    },
    plugins: [
      ...htmlPlugins,
    ],
  };

  if (argv.mode === 'production') {
    // Make production specific changes to config
    console.log('Running in PRODUCTION mode');
  } else {
    console.log('Running in DEVELOPMENT mode');
    // Make development specific changes to config
    // Add Hot Module Replacement config
    // config.plugins.push(new webpack.HotModuleReplacementPlugin());
    // config.devServer = {
    //   port: 9000,
    //   contentBase: path.resolve(__dirname, 'dist'),
    //   before() {
    //     spawn(
    //       'npm',
    //       ['run', 'electron:dev'],
    //       { shell: true, env: process.env, stdio: 'inherit' },
    //     )
    //       .on('close', code => process.exit(code))
    //       .on('error', () => false);
    //   }
    // };
  }

  return config;
};
