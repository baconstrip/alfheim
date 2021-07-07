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
import * as Messages from '../../../../types/messages.ts'
import { DialogEvent } from '../../../../types/dialog'
//import VRuntimeTemplate from "v-runtime-template";

export default {
    components: {
        //VRuntimeTemplate,
    },
    data: function() {
        return {
            contents: "",
            name: "",
        }
    },
    mounted: function() {
        let localThis = this;
        EventBus.$on('create-dialog', localThis.makeDialog);
        EventBus.$on('remove-dialog', localThis.closeDialog);
        EventBus.$on('read-dialog', localThis.readDialog);
        $('#dialogModal').on('hidden.bs.modal', function (e) {
          EventBus.$emit('send-message', Messages.BuildMessage(Messages.ClientMessage.CLOSE_DIALOG, {
            name: localThis.name,
          }));
          localThis.contents = "";
          localThis.name = "";
        });
    },
    methods: {
      makeDialog: function(msg) {
          // msg is Message.ServerMessage.CreateDialog
          this.contents = HTMLForDialog(msg.dialog);
          this.name = msg.name;
          $('#dialogModal').modal('show');
      },
      closeDialog: function(msg) {
        // check if the name is correct in the future
        EventBus.$emit('send-message', Messages.BuildMessage(Messages.ClientMessage.CLOSE_DIALOG, {
          name: this.name,
        }));
        this.contents = "";
        this.name = "";
        $('#dialogModal').modal('hide');
      },
      capture: function(e) {
        let localThis = this;
        EventBus.$emit('send-message', 
          Messages.BuildMessage(Messages.ClientMessage.DIALOG_INTERACT, 
            {
              action: DialogEvent.CLICK,
              element: e.target.id,
              dialogName: localThis.name,
            }
          )
        );
        console.log(e);
      },
      keystroke: function(e) {
        console.log(e);
      },
      readDialog: function(msg) {
        let id = msg.component;
        let contents = $(`#${id}`).val();
        EventBus.$emit('send-message', Messages.BuildMessage(Messages.ClientMessage.DIALOG_CONTENTS, {
          dialog: this.name,
          name: msg.component,
          contents: contents,
        }));
      },
    }
}
</script>
