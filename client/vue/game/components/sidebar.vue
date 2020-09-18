<template>
  <div class="container-fluid d-flex flex-column my-3 ">
    <div class="row">
      <h3>Status:</h3>
      <ul>
        <li>In game</li>
        <li>rooms available:</li>
      </ul>
    </div>
    <div class="row">
      <inventory></inventory>
    </div>
  </div>
</template>

<script>
import inventory from "./inventory.vue";

export default {
  components: {
    inventory,
  }
}
</script>