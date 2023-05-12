'use strict'

const { VueLoaderPlugin } = require('vue-loader')
const path = require('path');

const gameConfig = {
  mode: 'development',
  name: "gameconfig",
  entry: [
    'client/vue/game/index.js'
  ],
  output: {
    path: __dirname + '/static/js',
    filename: "game.js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'socs': '../',
    },
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      path.resolve(__dirname,'.'), 
      './client',
      './lib',
      './node_modules'
    ],
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

module.exports = gameConfig;