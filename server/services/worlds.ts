import fs from 'fs';
import path from 'path';
import World from '../game/api/prototype/world';
import md5 from 'md5';

const normalizedPath = path.join(__dirname + '/../worlds');

const byName: Map<string, World> = new Map();
const byID: Map<string, World> = new Map();

export default async ({}) => {
    fs.readdirSync(normalizedPath).forEach((file) => {
        try { 
            const world = require('../worlds/' + file).default as World;
            // Cast away read only to set this field, never set again.
            ___addWorld(world);
        } catch (e) {
            console.log('Error loading world definition from: ' + file);
        }
    });
}

export function ___addWorld(w: World, assetModule?: string) {
    w.___assetModule = assetModule;
    (w as any).id = md5(w.name);
    byName.set(w.name, w);
    byID.set(w.id, w);
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