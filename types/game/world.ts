import Room from "./room";
import Path from "./path";

export default class World {
    /**
     * A name for the world, may contain basic HTML attributes.
     */
    readonly name: string;
    readonly rooms: Room[];
    /**
     * A message sent when players join, may contain basic HTML attributes.
     */
    readonly joinMessage: string;
    /**
     * Room players start in when joining an instance of this world must be an
     * id of a room assigned to this world.
     */
    readonly defaultRoom: number;
    /**
     * Whether or not players can move freely between any room.
     * Defaults to false.
     */
    readonly unrestrictedMovement: boolean;
    /**
     * A set of paths that ajoin all the rooms. 
     */
    readonly paths: Path[];

    /**
     * Whether players can create instances of this world.
     * Defaults to true.
     */
    readonly loadable: boolean;

    readonly id!: string;

    constructor(s: {
        name: string,
        rooms: Room[],
        joinMessage: string,
        defaultRoom: number,
        unrestrictedMovement?: boolean,
        paths: Path[],
        loadable?: boolean
    }) {
        this.name = s.name;
        this.rooms = s.rooms;
        this.joinMessage = s.joinMessage;
        this.defaultRoom = s.defaultRoom;
        this.unrestrictedMovement = s.unrestrictedMovement ? s.unrestrictedMovement : false;
        this.loadable = s.loadable === false ? false : true;
        this.paths = s.paths;
    }
}