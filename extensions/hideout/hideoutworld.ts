import { PathDirection } from "../../common/direction";
import Path from "../../server/game/path";
import Room from "../../server/game/api/prototype/room";
import World from "../../server/game/api/prototype/world";
import Zone from "../../server/game/api/prototype/zone";

export default new World({
    name: "Hideout",
    shortName: "hideout",
    joinMessage: "<em>You find yourself at the top of a small mountain next to a stream, you can tell there's something hidden nearby</em>",
    defaultRoom: 1,
    unrestrictedMovement: false,
    defaultInventorySize: 4,

    rooms: new Array<Room>(
        new Room({
            id: 1,
            name: "Hilltop",
            description: "A serene scene, a stream flowing gently over the hilltop. However, you get the sense that there is more here than meets the eye...",
            img: "imgs/river.jpg",
            zone: 1,
        }),
        new Room({
            id: 2,
            name: "Hillside",
            description: "Walking from the river, you find the side of the hill you're on. You don't feel as if there's anything over here.",
            img: "imgs/hillside.jpg",
            zone: 1,
        }),
        new Room({
            id: 10,
            name: "Treewatch",
            description: "You stand on the mountain, overlooking trees shrouded in fog.",
            img: "$test$/trees.jpg",
            zone: 1,
        }),
        new Room({
            id: 3,
            name: "Stream",
            description: "You're at the bottom of the hill where the stream leads, there's some bridges over it here, and a wide open field to the West.",
            img: "imgs/hillbottom.jpg",
            zone: 1,
        }),
        new Room({
            id: 4,
            name: "Plains",
            description: "You're in the middle of a picturesque field, with nobody else nearby. As you look out over the vast flowing fields, you " +
                    "notive a gap in the ground off to the North, as if there was something cut out of the ground.",
            img: "imgs/plains.jpg",
            zone: 2,
        }),
        new Room({
            id: 5,
            name: "Cave Entrance",
            description: "You carefully approach the gap in the ground, and notice what appears to be the entrance to a cave. You feel compelled to go down into it.",
            img: "imgs/cave/entrance.jpg",
            zone: 2,
        }),
        new Room({
            id: 6,
            name: "Corridor",
            description: "The narrow gap at the opening to the cave gives way to a vast open hallway, from here you can only continue onwards.",
            img: "imgs/cave/corridor.jpg",
            zone: 3,
        }),
        new Room({
            id: 7,
            name: "Narrow Hallway",
            description: "As you proceed through the cave, it gradually gets narrower until you're squeezed through a corridor barely wide enough for one person, "+ 
                        "however you can something just up ahead.",
            img: "imgs/cave/squeeze.jpg",
            zone: 3,
        }),
        new Room({
            id: 8,
            name: "Cavernous room",
            description: "Finally free from the squeezing hallway, the cave opens to a room lit gently, it seems someone has been here recently, however you're " +
                        "certain that you're alone now.",
            img: "imgs/cave/room.jpg",
            zone: 3,
        }),
    ),
    paths: new Array<Path>(
        new Path({
            source: 1,
            dest: 2,
            direction: PathDirection.EAST_WEST,
            hidden: false,
        }),
        new Path({
            source: 1,
            dest: 3,
            direction: PathDirection.SOUTH_NORTH,
            hidden: false,
        }),
        new Path({
            source: 3,
            dest: 4,
            direction: PathDirection.WEST_EAST,
            hidden: false,
        }),
        new Path({
            source: 4,
            dest: 5,
            direction: PathDirection.NORTH_SOUTH,
            hidden: false,
        }),
        new Path({
            source: 5,
            dest: 6,
            direction: PathDirection.DOWN_UP,
            hidden: false,
        }),
        new Path({
            source: 6,
            dest: 7,
            direction: PathDirection.NORTH_SOUTH,
            hidden: false,
        }),
        new Path({
            source: 7,
            dest: 8,
            direction: PathDirection.EAST_WEST,
            hidden: false,
        }),
        new Path({
            source: 1, 
            dest: 10,
            direction: PathDirection.NORTH_SOUTH,
            hidden: false,
        })
    ),
    zones: new Array<Zone>(
        new Zone({
            name: "Hills",
            id: 1,
            description: "Gently flowing hills over a serene natural landscape",
            defaultRoom: 1,
        }),
        new Zone({
            name: "Plains",
            id: 2,
            description: "Vast plains, full of cleared land.",
            defaultRoom: 4,
        }),
        new Zone({
            name: "Caves",
            id: 3,
            description: "Dark caves that leave you with an uneasy feeling.",
            defaultRoom: 6,
        }),
    ),
});