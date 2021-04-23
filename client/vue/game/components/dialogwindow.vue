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
      <div class="modal-body" v-html="contents" v-on:click="capture" v-on:keyup="keystroke">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { EventBus } from '../../../eventbus'
import { HTMLForDialog } from '../../../dialogbuilder'
//import VRuntimeTemplate from "v-runtime-template";

export default {
    components: {
        //VRuntimeTemplate,
    },
    data: function() {
        return {
            contents: "",
        }
    },
    mounted: function() {
        let localThis = this;
        EventBus.$on('create-dialog', localThis.makeDialog);
        $('#dialogModal').on('hidden.bs.modal', function (e) {
          localThis.contents = "";
        });
    },
    methods: {
      makeDialog: function(msg) {
          // msg is Message.ServerMessage.CreateDialog
          this.contents = HTMLForDialog(msg.dialog);
          $('#dialogModal').modal('show');
      },
      capture: function(e) {
        console.log(e);
      },
      keystroke: function(e) {
        console.log(e);
      }
    }
}
</script>
