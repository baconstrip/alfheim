import World from "../types/game/world";
import Room from "../types/game/room";
import Path from "../types/game/path";
import { PathDirection } from "../types/game/direction";
import GameObject from "../types/game/gameobject";

export default new World({
    name: "Green Dungeon",
    shortName: "dungeon",
    joinMessage: "<em>You find yourself at the watery entrance to a verdant cave. You can't immediately tell how deep the cave goes...</em>",
    rooms: new Array<Room>(
        new Room({
            name: "Cave entrance", 
            description: "The cave's entrance is unusually green, " +
                "moss creeping up the small crevice the cave lies in. " +
                "You can smell something coming from inside the cave...",
            id: 0,
            img: '/static/images/cave_entrance.jpg',
        }),
        new Room({
            name: "Cavern", 
            description: "A narrow passage into the cave gives way to a " +
                "surprisingly vast cavern. Much larger than any outside " + 
                "observe would have anticipated, anyway. The cavern is half " +
                "filled with water, and it seems the lower tunnels are " +
                "impassible.",
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
    objects: new Array<GameObject>(
        new GameObject({
            name: "bucket",
            id: 0,
            inRoom: 0,
            portable: true,
            description: "It's a half full bucket, you're not sure what's in it.",
        }),
        new GameObject({
            name: "chest",
            id: 1,
            inRoom: 1,
            portable: false,
            contains: [2,3],
            description: "An oversized chest, carelessly tossed asunder in to the cavern, presumably by some forgetful pirate",
        }),
        new GameObject({
            name: "gold",
            id: 2,
            portable: true,
            infinite: true,
            description: "Yep, it's the real thing. An unbeliveable amount of gold."
        }),
        new GameObject({
            name: "diamond",
            id: 3,
            portable: true,
            description: "A massive diamond, brilliant cut and clear",
        }),
        new GameObject({
            name: "dead snake",
            portable: true,
            id: 4,
            hidden: true,
            description: "It gives you a scare at first, but you quickly realise it has already perished....more than a few days ago.",
        })
    ),
    defaultRoom: 0,
    unrestrictedMovement: false,
});