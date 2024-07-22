export enum Direction {
    NORTH = 1,
    SOUTH,
    EAST,
    WEST,
    UP,
    DOWN,
}

export enum PathDirection {
    NORTH_SOUTH = 1,
    SOUTH_NORTH,
    EAST_WEST,
    WEST_EAST,
    UP_DOWN,
    DOWN_UP
}

export function GetSourceDirection(p : PathDirection): Direction {
    switch (p) {
        case PathDirection.NORTH_SOUTH: 
            return Direction.NORTH;
        case PathDirection.SOUTH_NORTH:
            return Direction.SOUTH;
        case PathDirection.EAST_WEST:
            return Direction.EAST;
        case PathDirection.WEST_EAST:
            return Direction.WEST;
        case PathDirection.UP_DOWN:
            return Direction.UP;
        case PathDirection.DOWN_UP:
            return Direction.DOWN;
    }

    throw new Error('Can\'t resolve path direction');
}

export function GetDestinationDirection(p : PathDirection): Direction {
    switch (p) {
        case PathDirection.NORTH_SOUTH: 
            return Direction.SOUTH;
        case PathDirection.SOUTH_NORTH:
            return Direction.NORTH;
        case PathDirection.EAST_WEST:
            return Direction.WEST;
        case PathDirection.WEST_EAST:
            return Direction.EAST;
        case PathDirection.UP_DOWN:
            return Direction.DOWN;
        case PathDirection.DOWN_UP:
            return Direction.UP;
    }

    throw new Error('Can\'t resolve path direction');
}

export function DirectionFromWord(s: string): Direction | undefined {
    let found: Direction | undefined = undefined;
    Object.entries(Direction).forEach((k, v) => {
        if (k[0].toLowerCase() == s.toLowerCase()) {
            console.log("returned " + k[1]);
            found = k[1] as Direction;
        }
    });
    return found;
}