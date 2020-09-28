/**
 * GameEvents describe things that happen in the game world. Generally, if
 * this actions are motivated by a player's verb, handlers for these events
 * will be called after the verb "pre" phase, but before the verb "post"
 * phase.
 * 
 * If there are global listeners and per-instance listeners, global listeners
 * are invoked first, then per-instance listeners.
 */
export enum GameEvent {
    // These start at 1001 to prevent overlap with internal events.
    /**
     * Invoked when a player joins an instance. Cannot be cancelled.
     */
    PLAYER_JOIN_INSTANCE = 1001,
    /**
     * Invoked when a player leaves and instance. Cannot be canceleld.
     */
    PLAYER_LEAVE_INSTANCE, 

    /**
     * Invoked when an object changes from one inventory to another.
     * 
     * Can be cancelled.
     */
    OBJECT_MOVE,

    /**
     * Invoked when a player changes from one room to another.
     * 
     * Can be cancelled.
     */
    PLAYER_MOVE,

    /**
     * Invoked when a player or the system creates an instance. Can be 
     * cancelled.
     */
    CREATE_INSTANCE,

    /**
     * When a player is killed. Can be cancelled.
     */
    PLAYER_DEATH,

    /**
     * When a player is made re-corporeal. Can be cancelled.
     */
    PLAYER_REVIVE,
 }