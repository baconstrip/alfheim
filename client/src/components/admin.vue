<template>
    <div class="modal hide" id="adminModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"
        data-static="true" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Hello</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    HI!
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <h3>Players online:</h3>
                                <ul>
                                    <li v-for="ply in players">
                                        {{ ply.dname }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <h3>Instances active:</h3>
                                <ul>
                                    <li v-for="inst in instances">
                                        {{ inst }}
                                    </li>
                                </ul>
                            </div>
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
import { EventBus } from '../eventbus.ts'

export default {
    methods: {
        async example(e) {
        },
    },
    setup() {
    },
    mounted() {
        var localThis = this;
        EventBus.$on("admin-info", (msg) => {
            localThis.players = msg.allPlayers;
            localThis.instances = msg.instances;
        });
    },
    data() {
        return {
            players: [],
            instances: [],
        }
    }
}
</script>