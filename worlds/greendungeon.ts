import World from "../types/game/world";
import Room from "../types/game/room";
import Path from "../types/game/path";
import { PathDirection } from "../types/game/direction";

export default new World({
    name: "Green Dungeon",
    joinMessage: "<em>You find yourself at the watery entrence to a verdant cave. You can't immediately tell how deep the cave goes...</em>",
    rooms: new Array<Room>(
        new Room({
            name: "Cave entrance", 
            id: 0,
            img: '/static/images/cave_entrance.jpg',
        }),
        new Room({
            name: "Cavern", 
            id: 1,
            img: '/static/images/cavern.jpg',
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
    unrestrictedMovement: false,
});