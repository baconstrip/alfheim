<template>
<div class="modal hide" id="notebookModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="notebookModalTitle">Notebook</h5>
        <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
          <h4>Write in your notebook!</h4>
          <textarea id="notebook" class="mx-auto w-100" v-on:input="updateText"></textarea>
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
      async updateText(e) {
        if (!this.updateScheduled) {
          let localThis = this;
          setTimeout(() => {
            let contents = $("#notebook").val();
            const msg = Messages.BuildMessage(Messages.ClientMessage.UPDATE_NOTEBOOK, { contents: contents });
            EventBus.$emit('send-message', msg);
            this.updateScheduled = false;
          }, 5000);
          this.updateScheduled = true;
        }
      },
    },
    setup() {
    },
    mounted() {
      EventBus.$on("write-notebook", (msg) => {
        var doc = new DOMParser().parseFromString(msg.contents, "text/html");

        $("#notebook").val(doc.documentElement.textContent);
      });
    },
    data() {
      return {
        updateScheduled: false,
      }
    }
}
</script>
