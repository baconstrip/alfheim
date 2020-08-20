import Vue from 'vue';
import App from './components/main.vue';
import _ from 'lodash';
import { EventBus } from './components/eventbus.js';

let socs = require('socs.ts');

new Vue({
  el: '#app',
  render: h => h(App),
  mounted: () => {
    console.log('Connecting to server...');
    socs.connect((msg) => {
      EventBus.$emit('raw-message', msg);
    }, (err) => {
      EventBus.$emit('error', msg);
    });
    console.log('Connected!');
  }
});