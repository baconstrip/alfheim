import { PathDirection } from "./direction";

export class MapRepresentationRoom {
    id: number;
    name: string;
    players: string[];

    constructor(id: number, name: string, players: string[]) {
        this.id = id;
        this.players = players;
        this.name = name;
    }
}

export class MapPath {
    fromId: number;
    destId: number;
    direction: PathDirection;

    constructor(fromId: number, destId: number, direction: PathDirection) {
        this.fromId = fromId;
        this.destId = destId;
        this.direction = direction;
    }
}

export class MapRepresentation {
    // TODO make rooms a map<id, mrroom>
    rooms: MapRepresentationRoom[];
    paths: MapPath[];

    constructor() {
        this.rooms = [];
        this.paths = [];
    }
}