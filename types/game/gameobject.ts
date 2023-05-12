import { Lock } from "./locking";
import { Grab } from "./grabbing";

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
     * A lock that specifies whether or not a player can open this, if it is a
     * container. Has no effect if this is not a container. See Lock for usage.
     * 
     * Defaults to a function that always returns true if not set.
     */
    readonly lock: Lock;
    
    /**
     * A callback to invoke when players grab an object.
     */
    readonly grab: Grab;

    /**
     * Whether or not this item can contain other objects. Defaults to false if
     * not provided.
     */
    readonly container: boolean;

    /**
     * Whether the container will start locked. If lock is specified, defaults
     * to true, otherwise false. Has no meaning if this is not a container.
     */
    readonly startsLocked: boolean;

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
        container?: boolean,
        startsLocked?: boolean,
        grab?: Grab,
        lock?: Lock;
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
        this.container = s.container ?? false;
        this.hidden = s.hidden ?? false;
        this.description = s.description;
        this.lock = s.lock ?? function() {return true;};
        this.grab = s.grab ?? function () { };
        // Pick s.startsLocked, if it is present, otherwise if s.lock is
        // defined, use that. Otherwise, this is false.
        this.startsLocked = s.startsLocked ?? s.lock != undefined ? true : false;
    }
}

export type MutableGameObject = {
    -readonly [P in keyof GameObject]: GameObject[P];
}