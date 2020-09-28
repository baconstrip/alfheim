import path from "path";
import fs from 'fs';

const normalizedPath = path.join(__dirname + '/../extensions');

export default ({}) => {
    console.log('Loading extensions:');

    // Contains a map of a plugin's path to its descriptor, as a parsed JSON
    // object.
    const pluginDescriptions = new Map<string, Object>();
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

        console.log(`\tFound extension: ${module.name}`);
    });

    console.log('Finished loading extensions!');
}