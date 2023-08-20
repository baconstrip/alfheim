
export default class Zone {
    /**
     * A name for the zone, must be unique within the world.
     */
    readonly name: string;
    /**
     * An ID used to identify this zone, must be unique within the world.
     */
    readonly id: number;

    /**
     * A short snippet that describes the zone to the player.
     */
    readonly description: string;

    /**
     * Default room, when a player wants to go to this zone.
     */
    readonly defaultRoom: number;

    constructor(s : {
        name: string, 
        id: number, 
        description: string,
        defaultRoom: number,
    }) {
        this.name = s.name;
        this.id = s.id;
        this.description = s.description;
        this.defaultRoom = s.defaultRoom;
    }
}

export type MutableZone = {
    -readonly [P in keyof Zone]: Zone[P];
} 