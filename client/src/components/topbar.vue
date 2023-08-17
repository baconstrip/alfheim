<template>
  <div>
    <div>🌘 🌕 ☀ ⛅</div>
    <div class="text-right greeting-message">Hello, {{ username }}!</div>
  </div>
</template>

<script>
import { EventBus } from "../eventbus.ts";

export default {
  mounted: function() {
    
    let localThis = this;
    EventBus.$on("update-metadata", (msg) => {
      this.username = msg.username
    });
  },
  data: () => {
    return {
      username: '',
    };
  },
};
</script>