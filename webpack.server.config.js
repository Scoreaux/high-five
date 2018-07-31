const path = require('path');

const alias = require('./webpack.alias');

module.exports = (env, argv) => {
  // Create initial config object with options shared in both development and
  // production environments
  const config = {
    mode: argv.mode || 'development',
    target: 'node',
    context: path.resolve(__dirname, 'src'),
    entry: './server/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/server'),
      filename: 'index.js',
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
