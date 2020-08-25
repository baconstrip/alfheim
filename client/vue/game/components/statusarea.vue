<template>
  <div>
    <h2>{{ world }}</h2>
    <h4 class="pl-3"><em>{{ room }}</em></h4>
  </div>
</template>
<script>
import { EventBus } from "./eventbus.js";
import * as Messages from "../../../../types/messages.ts";

export default {
  data: function () {
    return {
      world: "",
      room: "",
    };
  },
  mounted: function () {
    let localThis = this;
    EventBus.$on("update-location", (msg) => {
      localThis.world = msg.world;
      localThis.room = msg.room;
    });
  },
};
</script>