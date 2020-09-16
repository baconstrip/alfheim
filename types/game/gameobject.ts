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
     * Objects that are contained within other objects must leave this unset.
     */
    readonly inRoom?: number;
    /**
     * The container this object starts in. If left undefined it will not be in
     * the world, but it will be available for other features to spawn it.
     * 
     * Objects that are in a Room must leave this unset.
     */
    readonly inContainer?: number;
    /**
     * Whether or not the object can be picked up. Defaults to false.
     */
    readonly portable: boolean;
    /**
     * Whether or not the object is an infinite source of itself. For example,
     * a box of matches may be an infinite source of matches. Defaults to false.
     * 
     * NOTE THIS IS CURRENTLY IGNORED
     */
    readonly infinite: boolean;

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
        inContainer?: number,
        portable?: boolean,
        infinite?: boolean,
        hidden?: boolean,
        description: string,
    }) {
        if (s.inRoom && s.inContainer) {
            throw new Error("Both inRoom and inContainer declared, objects must have one or zero parents.");
        }
        this.name = s.name;
        this.id = s.id;
        this.img = s.img;
        this.inRoom = s.inRoom;
        this.inContainer = s.inContainer;
        this.portable = s.portable ?? false;
        this.infinite = s.infinite ?? false;
        this.hidden = s.hidden ?? false;
        this.description = s.description;
    }
}

export type MutableGameObject = {
    -readonly [P in keyof GameObject]: GameObject[P];
}