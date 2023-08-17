<template>
  <div class="container-fluid d-flex flex-column my-3 alf-sidebar flex-grow-1">
    <div class="row">
      <playerlist></playerlist>
    </div>
    <div class="row">
      <inventory></inventory>
    </div>
    <div class="row mb-auto" id="filler"></div>
    <div class="row mr-auto ml-auto">
      <button class="btn btn-lg btn-primary" data-toggle="modal" data-target="#notebookModal">Notebook</button>
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