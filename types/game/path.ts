import { PathDirection } from "./direction";

export default class Path {
    source: number;
    dest: number;

    direction: PathDirection;

    hidden: boolean;

    constructor(s: {source: number, dest: number, direction: PathDirection, hidden: boolean}) {
        this.source = s.source;
        this.dest = s.dest;
        this.direction = s.direction;
        this.hidden = s.hidden;
    }
}

export type MutablePath = {
    -readonly [P in keyof Path]: Path[P];
} 
