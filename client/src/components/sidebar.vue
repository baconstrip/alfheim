<template>
  <div class="container-fluid d-flex flex-column my-3 alf-sidebar flex-grow-1">
    <div class="row">
      <playerlist></playerlist>
    </div>
    <div class="row">
      <inventory></inventory>
    </div>
    <div class="row mb-auto" id="filler"></div>
    <div class="row mr-auto ml-auto justify-content-center">
      <div class="col">
        <button class="btn btn-lg btn-primary" data-toggle="modal" data-target="#notebookModal">Notebook</button>
      </div>
      <div v-if="admin" class="col">
        <button class="btn btn-lg btn-danger" data-toggle="modal" data-target="#adminModal">Admin</button>
      </div>
    </div>
  </div>
</template>

<script>
import inventory from "./inventory.vue";
import playerlist from "./playerlist.vue";
import { EventBus } from "../eventbus.ts";

export default {
  components: {
    inventory,
    playerlist,
  },
  mounted: function () {
    let localThis = this;
    EventBus.$on("update-metadata", (msg) => {
      this.admin = msg.admin;
    });
  },
  data: () => {
    return {
      admin: false,
    };
  },
}
</script>