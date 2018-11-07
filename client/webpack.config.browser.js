const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const outputDir = path.resolve(__dirname, '../server/public/buildClient');
const ManifestPlugin = require('webpack-manifest-plugin');
module.exports = merge(baseConfig, {
  output: {
    path: outputDir
  },
  plugins: [
    new ManifestPlugin(),
    new webpack.DefinePlugin({
      __BROWSER__: true
    }),
    new ReactLoadablePlugin({
      filename: path.resolve(outputDir, 'react-loadable.json')
    })
  ]
});
