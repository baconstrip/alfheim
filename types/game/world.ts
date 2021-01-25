import Room, { MutableRoom } from "./room";
import Path, { MutablePath } from "./path";
import GameObject, { MutableGameObject } from "./gameobject";
import _ from "lodash";
import Zone from "./zone";

export default class World {
    /**
     * A name for the world, may contain basic HTML attributes.
     */
    readonly name: string;
    /**
     * A short name for the world, must only be one word.
     */
    readonly shortName: string;
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
     * List of all objects available in the world, these can be containers
     * themselves.
     */
    readonly objects: GameObject[];

    /**
     * Whether players can create instances of this world.
     * Defaults to true.
     */
    readonly loadable: boolean;

    /**
     * List of zones available in the world.
     */
    readonly zones: Zone[];

    /**
     * Default inventory size of players, if not set, this value is 2.
     */
    readonly defaultInventorySize: number;

    /**
     * A list of extensions that the World requires to work correctly. Can
     * be left unset, all Worlds will have global extensions applied.
     * 
     * The world will fail to load if any of these are not found.
     */
    readonly requiredExtensions: string[];

    /**
     * INTERNAL USE ONLY
     * 
     * Used to resolve the module that contains the assets.
     */
    ___assetModule?: string;

    readonly id!: string;

    constructor(s: {
        name: string,
        shortName: string,
        rooms: Room[],
        zones?: Zone[],
        joinMessage: string,
        defaultRoom: number,
        unrestrictedMovement?: boolean,
        paths: Path[],
        loadable?: boolean
        objects?: GameObject[],
        defaultInventorySize?: number,
        requiredExtensions?: string[],
    }) {
        this.name = s.name;
        this.shortName = s.shortName;
        this.rooms = s.rooms;
        this.zones = s.zones ?? [];
        this.joinMessage = s.joinMessage;
        this.defaultRoom = s.defaultRoom;
        this.unrestrictedMovement = s.unrestrictedMovement ?? false;
        this.loadable = s.loadable ?? true;
        this.paths = s.paths;
        this.objects = s.objects ?? [];
        this.defaultInventorySize = s.defaultInventorySize ?? 2;
        this.requiredExtensions = s.requiredExtensions ?? [];
    }

    toMutable(): MutableWorld {
        return _.cloneDeep(this) as MutableWorld;
    }
}

export type MutableWorld = {
    objects: MutableGameObject[]; 
    rooms: MutableRoom[];
    paths: MutablePath[];
} & {
    -readonly [P in keyof World]: World[P];
} 
