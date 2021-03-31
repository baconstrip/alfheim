<template>
<div class="modal hide" id="dialogModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-static="true" data-keyboard="false">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="notebookModalTitle"></h5>
        <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
          {{ contents }}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import dialogbutton from './dialogbutton.vue'
import { EventBus } from '../../../eventbus'

export default {
    components: [
        dialogbutton,
    ],
    data: function() {
        return {
            contents: "",
        }
    },
    mounted: function() {
        let localThis = this;
        EventBus.$on('create-dialog', localThis.makeDialog);
    },
    makeDialog: function(msg) {
        // msg is Message.ServerMessage.CreateDialog
        
    }
}
</script>
