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
     * URL to obtain the background image from.
     */
    readonly img: string;

    constructor(s : {name: string, id: number, img: string}) {
        this.name = s.name;
        this.id = s.id;
        this.img = s.img;
    }
}