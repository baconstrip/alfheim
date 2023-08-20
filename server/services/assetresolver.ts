import express from "express";
import { assetInExtension } from "./modules";
import {v4 as randomUUID} from "uuid";

// Singleton of resolver
class AssetResolver {
    private app: express.Application;
    private cache: Map<string, string>;

    constructor(app: express.Application) {
        this.app = app;
        this.cache = new Map();
    }

    public loadAsset(path: string): string {
        if (this.cache.has(path)) {
            // Assert this exists, as we just checked.
            return this.cache.get(path) as string;
        }

        let id = randomUUID();
        let uri = `/content/${id}`;
        this.app.get(uri, (req, res) => {
            res.sendFile(path, (err) => {
                if (err) {
                    console.log(`Error loading file from '${path}', ${err}`)
                }
            });
        });
        this.cache.set(path, uri);

        return uri;
    }

    public resolve(path: string, module?: string): string {
        if (path.startsWith('/')) {
            return path;
        }

        let internalRelative: RegExp = /[a-zA-Z][a-zA-Z0-9\/]*/i;
        let externalAssetRegex: RegExp = /\$([a-zA-Z][a-zA-Z0-9]*)\$\/(.*)/i;
        if (externalAssetRegex.test(path)) {
            // Assert that we have match, as we just tested for it.
            let groups = path.match(externalAssetRegex) as Array<string>;
            let inferredModule = groups[1];
            let internalPath = groups[2];
            let fullPath = assetInExtension(internalPath, inferredModule);
            return this.loadAsset(fullPath)
        } else if (internalRelative.test(path) ) {
            if (!module) {
                throw new Error(`Failed to resolve dynamically loaded relative asset in ${path}, as no module was specified`);
            }

            let fullPath = assetInExtension(path, module);
            return this.loadAsset(fullPath);
        } else {
            throw new Error(`Asset resolver could not resolve a file for ${path}`)
        }
    }
}
var ___inst: AssetResolver;

export default async ({app} : {app: express.Application}) => {
    ___inst = new AssetResolver(app);
}

/**
 * Resolve takes an asset string and resolves it to a location.
 * 
 * Optionally takes an Extension name to use as the fallback source for the 
 * image.
 * 
 * If module is not specified and a relative path is provided, this will return
 * a blank URL.
 * 
 * In the background, this method will load the asset into memory and create a 
 * random URL for the asset.
 * 
 * @param path path to resolve.
 * @param module? 
 */
export function resolve(path: string, module?: string): string {
    return ___inst.resolve(path, module);
}