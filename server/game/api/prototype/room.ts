export default class Room {
    /**
     * A name for the room, must be unique within the world.
     */
    readonly name: string;
    /**
     * An ID used to identify this room, must be unique within the world.
     */
    readonly id: number;

    /**
     * A short snippet that describes the room to the player.
     */
    readonly description: string;

    /**
     * URL to obtain the background image from.
     */
    readonly img: string;

    /**
     * ID of the zone this room is in, may be left unset.
     */
    readonly zone: number;

    constructor(s : {
        name: string, 
        id: number, 
        img: string,
        description: string,
        zone?: number,
    }) {
        this.name = s.name;
        this.id = s.id;
        this.img = s.img;
        this.description = s.description;
        this.zone = s.zone ?? -1;
    }
}

export type MutableRoom = {
    -readonly [P in keyof Room]: Room[P];
} 