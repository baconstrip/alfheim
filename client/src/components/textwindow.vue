<template>
  <div class="row text-container info mt-auto">
    <div class="row mx-auto w-100 h-100 d-block">
      <div id="text-log" class="mx-auto w-100 h-75" name="text-log" disabled>
      </div>
      <input id="text-input" type="text" class="mx-auto w-100 h-25" v-on:keyup="sendMessage" v-on:keydown="scrollRepeat" />
    </div>
  </div>
</template>

<script>
import { EventBus } from '../eventbus.ts'
import * as Messages from '../../../common/messages.ts';

export default {
  methods: {
    sendMessage: function(e) {
      if (event.key !== "Enter") {
        return;
      }

      const input = $('#text-input').val();
      $('#text-input').val("");
      const msg = Messages.BuildMessage(Messages.ClientMessage.TEXT_INPUT, {input: input});
      EventBus.$emit('send-message', msg);

      this.repeatCommandPosition = 0;
      this.repeatCommand.push(input);
    },
    scrollRepeat: function(e) {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
        return;
      }

      if (event.key == "ArrowUp") {
        // RepeatCommandPosition will be negative, so we have to negate it to compare with length.
        if (-this.repeatCommandPosition < this.repeatCommand.length) {
          this.repeatCommandPosition--;
        }
      }
      if (event.key == "ArrowDown") {
        if (this.repeatCommandPosition < 0) {
          this.repeatCommandPosition++;
        }
      }

      if (this.repeatCommandPosition == 0) {
        $('#text-input').val("");
      } else {
        let text = this.repeatCommand.at(this.repeatCommandPosition);
        $('#text-input').val(text);
      }
    }
  },
  mounted: () => {
    EventBus.$on('write-textlog', (x) => {
        const containedMessage = "<div class='textlog-message'>" + x + "</div>";
        $('#text-log').html($('#text-log').html() + containedMessage);
        $('#text-log').scrollTop(1e9);
    });
    EventBus.$on('clear-textlog', (x) => {
        $('#text-log').html('');
        $('#text-log').scrollTop(1e9);
    });

    $('#text-input').focus();
  }, 
  data: function() {
    return {
      repeatCommand: [],
      repeatCommandPosition: 0,
    };
  },
};
</script>