<template>
  <div>
    <h2>{{ world }}</h2>
    <h4 class="pl-3"><em>{{ room }}</em><em v-if="zone"> ({{ zone }})</em></h4>
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
      zone: "",
    };
  },
  mounted: function () {
    let localThis = this;
    EventBus.$on("update-location", (msg) => {
      localThis.world = msg.loc.world;
      localThis.room = msg.loc.room;
      localThis.zone = msg.loc.zone;
    });
  },
};
</script>