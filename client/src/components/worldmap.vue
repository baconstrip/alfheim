<template>
<div class="modal hide" id="mapModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="mapModalTitle">Map</h5>
        <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row no-gutters">
          <div class="col-xs-12 col-md-3">
            <h4>Floors</h4>
            <div class="d-flex flex-column">
              <button type="button" class="btn btn-primary floor-button mx-auto mb-2" v-for="i in floorCount" :key="i">Floor {{ i }}</button>
            </div>
          </div>
          <div class="col-xs-12 col-md-9">
            <canvas id="map"></canvas>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { EventBus } from '../eventbus.ts';
import { ParsedMap } from '../maputility.ts';

export default {
  methods: {
    // drawMap() takes the parsed map as an argument and attempts
    // to draw it to the map view
    drawMap(map) {
      let cw = $("#map")[0].width;
      let ch = $("#map")[0].height;

      let ctx = $("#map")[0].getContext("2d");

      // draw background
      ctx.fillStyle = "rgb(240, 240, 240)"
      ctx.fillRect(0, 0, cw, ch);

      // For now, a simple algorithm that draws each room on top of each other
      // if they form a loop, and divides up/down into multiple floors.
    },
  },
  setup() {
  },
  data: function () {
    return {
      floorCount: 3,
    };
  },
  mounted() {
    EventBus.$on("update-map", (msg) => {
      let map = msg.map;
      const parsedMap = new ParsedMap(map);

      this.drawMap(parsedMap);
    });
  },
}
</script>