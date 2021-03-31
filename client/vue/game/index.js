import Vue from 'vue';
import App from './components/main.vue';
import _ from 'lodash';
import { EventBus } from '../../eventbus';
import messageprocessing from './messageprocessing.ts';

let socs = require('socs.ts');

new Vue({
  el: '#app',
  render: h => h(App),
  mounted: () => {
    console.log('Connecting to server...');
    const socCallback = socs.connect((msg) => {
      EventBus.$emit('raw-message', msg);
    }, (err) => {
      EventBus.$emit('error', msg);
    });
    EventBus.$on('send-message', (x) => {
      socCallback((x instanceof Object) ? x : {x});
    });
    console.log('Connected!');

    messageprocessing({}); 
  }
});