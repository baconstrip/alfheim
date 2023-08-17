<template>
<div class="d-flex container-fluid flex-column player-container text-center">
    <div class="row p-2"><h3>Players</h3></div>
    <div class="row d-flex p-2"> 
      <div class="col-12 text-center" v-for="player in players" :key="player.dname">
        <div class="player-space my-1 p-1">
          {{ player.dname }}
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { EventBus } from '../eventbus.ts'

export default {
  data: function() {
    return {
      players: [],
    };
  },
  mounted: function () {
    let localThis = this;
    EventBus.$on("send-players", (msg) => {
        this.players = msg.players;
    });
  },
}
</script>