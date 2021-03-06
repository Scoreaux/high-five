const path = require('path');
const nodeExternals = require('webpack-node-externals');

const alias = require('./webpack.alias');

module.exports = (env, argv) => {
  // Create initial config object with options shared in both development and
  // production environments
  const config = {
    mode: argv.mode || 'development',
    target: 'node',
    externals: [nodeExternals()],
    context: path.resolve(__dirname, 'src'),
    entry: './app/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/app'),
      filename: 'index.js',
      library: 'highFive',
      libraryTarget: 'umd',
    },
    node: {
      __dirname: false,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: '/node_modules/',
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
    resolve: {
      alias,
    },
  };

  if (argv.mode === 'production') {
    // Make production specific changes to config
    console.log('Running in PRODUCTION mode');
  } else {
    // Make development specific changes to config
    console.log('Running in DEVELOPMENT mode');
  }

  return config;
};
