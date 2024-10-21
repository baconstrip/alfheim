import { MapRepresentation, MapRepresentationRoom } from "../../common/worldmap";

function __checkFloorsRecur(room: MapRepresentationRoom, m: MapRepresentation, visited: Set<number>) {
    
}

export class ParsedMap {

    constructor(m: MapRepresentation) {
        var upDownVisted = new Set<number>();

        // Visit every room and solve for floors.
        
        // TODO doesn't currently solve for room "islands"
        __checkFloorsRecur(m.rooms[0], m, upDownVisted);
    }
}

