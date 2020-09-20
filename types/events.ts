export enum AlfInternalEvent {
    // Unimplemented
    PLAYER_REGISTER = 0,
    /**
     * Emitted when a player joins the interactive game session.
     */
    PLAYER_JOIN_LIVE,
    /**
     * Emitted when a player joins the interactive game session, after 
     * AlfEvent.PLAYER_JOIN_LIVE has finished processing.
     */
    POST_PLAYER_JOIN_LIVE,
    PLAYER_DISCONNECT_LIVE,
    PLAYER_CLEANUP,
    /** Emitted when a user logs in to the service */
    PLAYER_LOGIN,
    // Unimplemented
    PLAYER_LOGOUT,
    // Unimplemented
    PLAYER_UNBIND_INSTANCE,
    // Unimplemented
    PLAYER_BIND_INSTANCE,
    /** 
     * Emitted when a message is recieved from a client. You probably don't
     * want to use this event, see AlfEvent.MESSAGE_IN instead. 
     */
    RAW_MESSAGE_IN,
    /** Emitted when the server sends a message to a client. */
    RAW_MESSAGE_OUT,
    /** 
     * Emitted after the server has parsed a message from the client and
     * filtered the message. 
     */
    MESSAGE_IN,
    // Unimplemented
    MESSAGE_OUT,
}