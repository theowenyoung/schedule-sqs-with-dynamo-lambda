const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    'consumer-lambda': path.resolve(__dirname, 'consumer-lambda.js'),
    'receive-lambda': path.resolve(__dirname, 'receive-lambda.js')
  },
  externals: ['aws-sdk', nodeExternals()],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
  plugins: [],
  target: 'node'
};
