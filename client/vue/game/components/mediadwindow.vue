<template>
  <div class="row">
    <img class="room-image mx-auto" v-bind:src="backgroundimg" />
  </div>
</template>

<script>
import { EventBus } from '../../../eventbus.ts'
import * as Messages from '../../../../types/messages.ts';

export default {
  data: function() {
    return {
      'backgroundimg': "",
    }
  },
  mounted: function () {
    let localThis = this;
    EventBus.$on("update-media", (msg) => {
      if (msg.img) {
        localThis.backgroundimg = msg.img;
      }
    });
  },
}
</script>