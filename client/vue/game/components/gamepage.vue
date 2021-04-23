<template>
  <div class="container-fluid game-window d-flex flex-column">
    <div class="row">
      <div class="col-3">
        <statusarea></statusarea>
      </div>
      <div class="col-9">
        <topbar></topbar>
      </div>
    </div>
    <div class="row bg-dark fixed-height-3"></div>
    <div class="row d-flex flex-grow-1">
      <div class="container-flex d-flex flex-grow-1">
        <!-- Main game window -->
        <div class="col-3 flex-grow-1 sidebar text-light d-flex flex-column">
          <sidebar></sidebar>
        </div>
        <div class="col-9 flex-grow-1 d-flex">
          <div class="container my-3 d-flex flex-column flex-grow-1">
            <mediawindow></mediawindow>
            <textwindow></textwindow>
          </div>
        </div>
      </div>
    </div>
    <notebook></notebook>
    <dialogwindow></dialogwindow>
  </div>
</template>

<script>
import textwindow from "./textwindow.vue";
import mediawindow from "./mediadwindow.vue";
import sidebar from "./sidebar.vue";
import statusarea from "./statusarea.vue";
import topbar from "./topbar.vue";
import notebook from "./notebook.vue";
import dialogwindow from "./dialogwindow.vue";

export default {
  components: {
    textwindow,
    mediawindow,
    sidebar,
    statusarea,
    topbar,
    notebook,
    dialogwindow,
  },
};
</script>