import fs from 'fs';
import path from 'path';
import World from '../types/game/world';
import md5 from 'md5';

const normalizedPath = path.join(__dirname + '/../worlds');

const byName: Map<string, World> = new Map();
const byID: Map<string, World> = new Map();

export default async ({}): Promise<Map<string, World>> => {
    const worlds = new Map<string, World>();
    fs.readdirSync(normalizedPath).forEach((file) => {
        try { 
            const world = require('../worlds/' + file).default as World;
            // Cast away read only to set this field, never set again.
            (world as any).id = md5(world.name);
            worlds.set(world.name, world);
            byName.set(world.name, world);
            byID.set(world.id, world);
        } catch (e) {
            console.log('Error loading world definition from: ' + file);
        }
    });
    return worlds;
}

export function WorldByName(name: string): World | undefined {
    return byName.get(name);
}

export function WorldByID(id: string): World | undefined {
    return byID.get(id);
}

export function AllWorlds(): World[] {
    return [...byName.entries()].map((x) => x[1]);
}