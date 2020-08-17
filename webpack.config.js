'use strict'

const { VueLoaderPlugin } = require('vue-loader')
const path = require('path');

module.exports = {
  mode: 'development',
  entry: [
    './client/vue/index.js'
  ],
  output: {
    path: __dirname + '/static/js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'socs': '../',
    },
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