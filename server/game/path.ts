import { PathDirection } from "./direction";
import { Lock } from "./api/locking";

export default class Path {
    source: number;
    dest: number;

    direction: PathDirection;

    /**
     * A lock that determines if a player is allowed to traverse this path. 
     * If left unset, will default to always returning true.
     */
    lock: Lock;

    hidden: boolean;

    constructor(s: {source: number, dest: number, direction: PathDirection, hidden: boolean, lock?: Lock}) {
        this.source = s.source;
        this.dest = s.dest;
        this.direction = s.direction;
        this.hidden = s.hidden;
        this.lock = s.lock ?? function() {return true;};
    }
}

export type MutablePath = {
    -readonly [P in keyof Path]: Path[P];
} 
