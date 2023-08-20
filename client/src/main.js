import {createApp} from 'vue';
import App from './main.vue';
import _ from 'lodash';
import jQuery from "jquery";

import '@popperjs/core';
import * as bootstrap from 'bootstrap';
window.$ = window.jQuery = jQuery;

//createApp(App).mount('#app');
var app = createApp(App);
app.config.performance = true;
app.config.devtools = true;
app.mount("#app");