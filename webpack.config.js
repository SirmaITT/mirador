var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build/mirador');
var TEMP_BUILD_DIR = path.resolve(__dirname, 'build/temp');
var SOURCE_DIR = path.resolve(__dirname, 'js/src');
var LIB_DIR = path.resolve(__dirname, 'js/lib');

module.exports = {
  entry: [
    SOURCE_DIR + '/mirador.es6.js'
  ],
  output: {
    path: TEMP_BUILD_DIR,
    filename: 'mirador.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: SOURCE_DIR,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.es6.js'],
    modulesDirectories: [
      LIB_DIR,
      SOURCE_DIR
    ]
  },
  debug: true
};