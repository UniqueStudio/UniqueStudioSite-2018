const webpack = require('webpack');
const merge = require('webpack-merge');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./webpack.config.browser');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: 'chunk.[name].[chunkhash].js'
  },
  plugins: [
    new cleanWebpackPlugin('./server/public/'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].[chunkhash].css',
      allChunks: true
    })
  ]
});
