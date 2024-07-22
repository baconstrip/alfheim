<template>
<div class="modal hide" id="mapModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="mapModalTitle">Map</h5>
        <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h3>Here's the map</h3>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { EventBus } from '../eventbus.ts'
import * as Messages from '../../../common/messages.ts';

export default {
    methods: {
    },
    setup() {
    },
    mounted() {
      EventBus.$on("update-map", (msg) => {
        // update the map here
      });
    },
    data() {
    }
}
</script>