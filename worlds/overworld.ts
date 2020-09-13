import World from "../types/game/world";
import Room from "../types/game/room";
import Path from "../types/game/path";
import { PathDirection } from "../types/game/direction";

export default new World({
    name: "Overworld",
    shortName: "overworld",
    joinMessage: "<em>You've been transported to a mysterious realm. You're in an open field.</em>",
    rooms: new Array<Room>(
        new Room({
            name: "Hub", 
            description: "So this is where it all begins, at the outset " +
                "of your adventure. You can only see a path that leads north",
            id: 0,
            img: '/static/images/fantasy.jpg'
        }),
        new Room({
            name: "Pub", 
            description: "The local pub.",
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