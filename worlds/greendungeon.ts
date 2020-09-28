import World from "../types/game/world";
import Room from "../types/game/room";
import Path from "../types/game/path";
import { PathDirection } from "../types/game/direction";
import GameObject from "../types/game/gameobject";
import Zone from "../types/game/zone";

export default new World({
    name: "Green Dungeon",
    shortName: "dungeon",
    joinMessage: "<em>You find yourself at the watery entrance to a verdant cave. You can't immediately tell how deep the cave goes...</em>",
    defaultRoom: 1,
    unrestrictedMovement: false,
    defaultInventorySize: 1,

    rooms: new Array<Room>(
        new Room({
            name: "Cave entrance", 
            description: "The cave's entrance is unusually green, " +
                "moss creeping up the small crevice the cave lies in. " +
                "You can smell something coming from inside the cave...",
            id: 1,
            zone: 1,
            img: '/static/images/cave_entrance.jpg',
        }),
        new Room({
            name: "Cavern", 
            description: "A narrow passage into the cave gives way to a " +
                "surprisingly vast cavern. Much larger than any outside " + 
                "observe would have anticipated, anyway. The cavern is half " +
                "filled with water, and it seems the lower tunnels are " +
                "impassible.",
            id: 2,
            zone: 2,
            img: '/static/images/cavern.jpg',
        }),
    ),
    zones: new Array<Zone>(
        new Zone({
            name: "Surface",
            id: 1,
            description: "Surface area of the cave",
            defaultRoom: 1,
        }),
        new Zone({
            name: "Underground",
            id: 2,
            description: "Under the ground, inside the cave",
            defaultRoom: 2,
        }),
    ),
    paths: new Array<Path>(
        new Path({
            source: 1,
            dest: 2,
            direction: PathDirection.DOWN_UP,
            hidden: false
        }),
    ),
    objects: new Array<GameObject>(
        new GameObject({
            name: "bucket",
            id: 1,
            inRoom: 1,
            portable: true,
            description: "It's a half full bucket, you're not sure what's in it.",
        }),
        new GameObject({
            name: "chest",
            id: 2,
            inRoom: 2,
            portable: false,
            container: true,
            description: "An oversized chest, carelessly tossed asunder in to the cavern, presumably by some forgetful pirate",
        }),
        new GameObject({
            name: "gold",
            id: 3,
            inContainer: 2,
            portable: true,
            infinite: true,
            description: "Yep, it's the real thing. An unbeliveable amount of gold."
        }),
        new GameObject({
            name: "diamond",
            id: 4,
            inContainer: 2,
            portable: true,
            description: "A massive diamond, brilliant cut and clear",
        }),
        new GameObject({
            name: "dead snake",
            portable: true,
            id: 5,
            inRoom: 2,
            hidden: true,
            description: "It gives you a scare at first, but you quickly realise it has already perished....more than a few days ago.",
        }),
        new GameObject({
            name: "Orb of Power",
            portable: true,
            id: 6,
            description: "Its overwhelming aura flows through you, you feel like you could fly.",
        }),
        new GameObject({
            name: "Box",
            inRoom: 1,
            id: 7,
            container: true,
            lock: (lockArgs) => {
                lockArgs.ply.sendMessage("The box scowls at you as you open it.");
                return true;
            },
            description: "A simple cardboard box.",
        }), 
        new GameObject({
            name: "lump",
            inContainer: 7,
            id: 8,
            description: "A small, indistinct lump of...<em>something</em>.",
        }), 
        new GameObject({
            name: "Shipping crate",
            inRoom: 1,
            id: 9,
            container: true,
            portable: true,
            lock: (lockArgs) => {
                if (lockArgs.ply.location?.forRoom.id == 2) {
                    return true;
                }
                lockArgs.ply.sendMessage("You get the feeling this crate will only open in the cavern.");
                return false;
            },
            description: "A small non-descript shipping box. It doesn't have any indentifying marks.",
        }),
        new GameObject({
            name: "McGuffin",
            inContainer: 9,
            id: 10,
            portable: true,
            description: "The magical McGuffin that will surely drive this plot forward",
        })
    ),
});