<template>
  <div>
    <div class="container">
      <div class="row align-items-center">
        <div class="col">
          <div>🌘 🌕 ☀ ⛅</div>
        </div>
        <div v-if="admin" class="col">
          <div class="alert alert-danger mt-3">You are an admin!</div>
        </div>
        <div class="col">
          <div class="text-right greeting-message">Hello, {{ username }}!</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../eventbus.ts";

export default {
  mounted: function () {
    let localThis = this;
    EventBus.$on("update-metadata", (msg) => {
      this.username = msg.username;
      this.admin = msg.admin;
    });
  },
  data: () => {
    return {
      username: '',
      admin: false,
    };
  },
};
</script>