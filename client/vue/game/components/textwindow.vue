<template>
  <div class="row h-25 text-container bg-primary info mt-auto">
    <div class="row mx-auto w-100 h-100 d-block">
      <div id="text-log" class="mx-auto w-100 h-75" name="text-log" disabled>
      </div>
      <input id="text-input" type="text" class="mx-auto w-100 h-25" v-on:keyup="sendMessage" />
    </div>
  </div>
</template>

<script>
import { EventBus } from '../../../eventbus.ts'
import * as Messages from '../../../../types/messages.ts';

export default {
  methods: {
    sendMessage: (e) => {
      if (event.key !== "Enter") {
        return;
      }

      const input = $('#text-input').val();
      $('#text-input').val("");
      const msg = Messages.BuildMessage(Messages.ClientMessage.TEXT_INPUT, {input: input});
      EventBus.$emit('send-message', msg);
    },
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
  }
};
</script>