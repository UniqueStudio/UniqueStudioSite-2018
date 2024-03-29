const baseConfig = require('./webpack.config.browser');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  watch: true,
  watchOptions: {
    aggregateTimeout: 1000,
    poll: 3000
  },
  devServer: {
    host: '0.0.0.0',
    hot: false,
    inline: true,
    port: 3330,
    disableHostCheck: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept, Content-Type'
    }
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new WriteFilePlugin()
  ]
});
