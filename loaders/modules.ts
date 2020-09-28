import path from "path";
import fs from 'fs';
import World from "../types/game/world";
import { ___addWorld } from "../services/worlds";
import { ModuleData } from "../services/moduledata";

const normalizedPath = path.join(__dirname + '/../extensions');

class ___extensionManager {
    extensionDescriptions = new Map<string, any>();
    loadedPlugins = new Map<string, any>();
    loadedFeatures = new Map<string, any>();
}

const ___inst = new ___extensionManager();

export default ({}) => {
    console.log('Loading extensions:');

    // Contains a map of a plugin's path to its descriptor, as a parsed JSON
    // object.
    fs.readdirSync(normalizedPath).forEach((file) => {
        const name = path.join(normalizedPath, file);
        if (!fs.statSync(name).isDirectory()) {
            // TODO: We should be able to load zips here.
            console.log(`Discarding individual file in plugins: ${name}`);
            return;
        }

        let module: any;
        // Now we look for a package.json
        fs.readdirSync(name).forEach((file) => {
            if (file.toLowerCase() === "package.json") {
                module = require(path.join(name, file)); 
            }
        });
        if (!module) {
            console.log(`Discarding extension without package.json: ${name}`);
        }
        // Attach the baseDir to the module
        module.__baseDir = name;

        ___inst.extensionDescriptions.set(module.name.toLowerCase(), module);
        console.log(`\tFound extension: ${module.name}`);
    });

    // Run setup on all the extensions we found.
    // This is a terrible hack and should be deleted.
    for (let i = 0; i < 10; i++) {
        let skipped = false;
        for (const [name, description] of ___inst.extensionDescriptions) {
            if (___inst.loadedPlugins.get(name)) {
                continue;
            }

            // If a dependency is missing, try again later.
            let missingDep = false;
            description.plugin.requires?.forEach((x: string) => {
                if (!___inst.loadedFeatures.get(x)) {
                    missingDep = true;
                }
            });
            if (missingDep) {
                skipped = true;
                continue;
            }

            const modData = new ModuleData(name.toLowerCase());

            // Otherwise, load it immediately.

            const dir = description.__baseDir;

            const extension = require(path.normalize(path.join(dir, description.main)));
            extension.setup(modData);
            ___inst.loadedPlugins.set(name, extension);

            description.plugin.features.forEach((x: string)=> {
                ___inst.loadedFeatures.set(x, extension.features[x]);
            });
        }

        if (!skipped) {
            break;
        }
    }

    for (const name of ___inst.extensionDescriptions.keys()) {
        if (!___inst.loadedPlugins.get(name)) {
            console.log(`ERROR: Failed to load plugin ${name}`);
        }
    }

    ___inst.loadedPlugins.forEach((x: any) => {
        const worldFunc = x['worlds'];
        if (worldFunc) {
            worldFunc().forEach((w: World) => {
                ___addWorld(w);
            });
        }
    });

    console.log('Finished loading extensions!');
}