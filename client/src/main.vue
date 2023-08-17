<template>
  <gamepage></gamepage>
</template>
<script>
import textwindow from "./components/textwindow.vue"
import gamepage from "./components/gamepage.vue"
import { EventBus } from './eventbus';
import messageprocessing from './messageprocessing.ts';
import {connect} from './socs.ts';

export default {
  components: {
    gamepage,
    textwindow
  },
  mounted: () => {
    console.log('Connecting to server...');
    const socCallback = connect((msg) => {
      EventBus.$emit('raw-message', msg);
    }, (err) => {
      EventBus.$emit('error', msg);
    });
    EventBus.$on('send-message', (x) => {
      socCallback((x instanceof Object) ? x : { x });
    });
    console.log('Connected!');

    messageprocessing({});
  }
}
</script>

<style lang="scss">
@import "./scss/styles.scss";
</style>