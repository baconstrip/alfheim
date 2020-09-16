export enum WorldEntityType {
    PLAYER = 1,
    OBJECT,
    ROOM,
    WORLD,
}

export function EntityTypeFromTags(tags: string[]) {
    for (let t in tags) {
        switch (t) {
            case "Player":
                return WorldEntityType.PLAYER;
            case "WorldObject":
                return WorldEntityType.OBJECT;
            case "Room":
                return WorldEntityType.ROOM;
            case "World":
                return WorldEntityType.WORLD;
        }
    }
}

export function EntityTypeToTag(e: WorldEntityType): string {
    switch (e) {
        case WorldEntityType.PLAYER:
            return "Player";
        case WorldEntityType.OBJECT:
            return "WorldObject";
        case WorldEntityType.ROOM:
            return "Room";
        case WorldEntityType.WORLD:
            return "World";
    }

    return "";
}