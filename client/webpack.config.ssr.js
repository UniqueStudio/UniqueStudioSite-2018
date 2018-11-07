const path = require('path');
const baseConfig = require('./webpack.config.base');
const merge = require('webpack-merge');
const webpack = require('webpack');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const WriteFilePlugin = require('write-file-webpack-plugin');
const outputDir = path.resolve(__dirname, '../server/public/buildServer');
module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    path: outputDir,
    filename: '[name].js',
    chunkFilename: 'chunk.[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /.(jsx?|tsx?)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              envName: 'node'
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  externals: [
    nodeExternals({
      whitelist: [
        /\.css$/,
        'geometry-extrude',
        'claygl-advanced-renderer',
        'zrender',
        'zrender/src/core/util',
        'claygl',
        'claygl/src/glmatrix/vec2'
      ]
    })
  ],
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }), // ssr 情况下禁止前端拆包
    new cleanWebpackPlugin(outputDir),
    new webpack.DefinePlugin({
      __NODE__: true,
      __BROWSER__: false
    }),
    new WriteFilePlugin()
  ],
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  }
});
