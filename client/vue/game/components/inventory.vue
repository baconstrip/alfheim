<template>
<div class="d-flex container-fluid flex-column inventory-container text-center">
    <div class="row p-2"><h3>Inventory</h3></div>
    <div class="row d-flex p-2"> 
      <div class="col-6 text-center" v-for="n in size" :key="n">
        <div class="inventory-space">
          <em><span class="inventory-label" v-if="items[n-1]" data-toggle="tooltip" data-placement="bottom" v-bind:title="items[n-1].description">{{ items[n-1].name }}</span></em>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { EventBus } from './eventbus.js'

export default {
  data: function() {
    return {
      size: 0,
      items: [],
    };
  },
  mounted: function () {
    let localThis = this;
    EventBus.$on("send-inventory", (msg) => {
        this.items = msg.items;
        this.size = msg.size;

        $('[data-toggle="tooltip"]').tooltip()
    });
  },
}
</script>