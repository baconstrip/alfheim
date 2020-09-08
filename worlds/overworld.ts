import World from "../types/game/world";
import Room from "../types/game/room";
import Path from "../types/game/path";
import { PathDirection } from "../types/game/direction";

export default new World({
    name: "Overworld",
    joinMessage: "<em>You've been transported to a mysterious realm. You're in an open field.</em>",
    rooms: new Array<Room>(
        new Room({
            name: "Hub", 
            id: 0,
            img: '/static/images/fantasy.jpg'
        }),
        new Room({
            name: "Pub", 
            id: 1,
            img: '/static/images/pub.jpg'
        }),
    ),
    paths: new Array<Path>(
        new Path({
            source: 0,
            dest: 1,
            direction: PathDirection.NORTH_SOUTH,
            hidden: false
        }),
    ),
    defaultRoom: 0,
    unrestrictedMovement: true,
    loadable: false,
});