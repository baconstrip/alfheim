import Vue from 'vue';
import App from './main.vue';
import _ from 'lodash';

let socs = require('socs.ts');

console.log(socs.connect);

socs.connect();

console.log('run');
console.log(_.VERSION);
var app = new Vue({
  el: '#app',
  render: h => h(App)
});