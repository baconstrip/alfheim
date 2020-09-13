/**
 * GameObjects represent all interactable objects within a room.
 */
export default class GameObject {
    /**
     * A name for the object.
     */
    readonly name: string;
    /**
     * An ID used to identify this object, must be unique within the world.
     */
    readonly id: number;
    /**
     * A short description the player is given when the object is examined.
     */
    readonly description: string;

    /**
     * The room this object starts in. If left undefined, it will not be in the
     * world, but it will be available for other features to spawn it.
     * 
     * Objects that are contained within other objects should leave this unset.
     */
    readonly inRoom: number;
    /**
     * Whether or not the object can be picked up. Defaults to false.
     */
    readonly portable: boolean;
    /**
     * Whether or not the object is an infinite source of itself. For example,
     * a box of matches may be an infinite source of matches. Defaults to false.
     */
    readonly infinite: boolean;
    /**
     * List of IDs of objects that this object contains. 
     */
    readonly contains: number[];

    /**
     * Specifies whether the object is visible to a player by default. 
     */
    readonly hidden: boolean;


    /**
     * URL that contains an optional sprite for the object.
     */
    readonly img?: string;

    constructor(s : {
        name: string, 
        id: number, 
        img?: string,
        inRoom?: number,
        portable?: boolean,
        infinite?: boolean,
        contains?: number[],
        hidden?: boolean,
        description: string,
    }) {
        this.name = s.name;
        this.id = s.id;
        this.img = s.img;
        this.inRoom = s.inRoom ?? -1;
        this.portable = s.portable ?? false;
        this.infinite = s.infinite ?? false;
        this.contains = s.contains ?? [];
        this.hidden = s.hidden ?? false;
        this.description = s.description;
    }
}

export type MutableGameObject = {
    -readonly [P in keyof GameObject]: GameObject[P];
}