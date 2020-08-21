import { AuthUser } from "../models/User";

export class Player {
    authUser!: AuthUser;
    soc!: WebSocket;
}