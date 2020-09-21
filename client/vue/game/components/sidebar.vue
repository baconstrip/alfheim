<template>
  <div class="container-fluid d-flex flex-column my-3 alf-sidebar">
    <div class="row">
      <playerlist></playerlist>
    </div>
    <div class="row">
      <inventory></inventory>
    </div>
  </div>
</template>

<script>
import inventory from "./inventory.vue";
import playerlist from "./playerlist.vue";

export default {
  components: {
    inventory,
    playerlist,
  }
}
</script>