import { AlfheimConfig } from "./configuration";
import * as discord from 'discord.js';
import { asPromise } from "../lib/util";
import { ___initializeDiscord } from "../services/discord";


export default async ({config}: {config: AlfheimConfig}): Promise<boolean> => {
    const client = new discord.Client();

    client.login(config.discordToken);

    await asPromise(client, client.on, 'ready');

    if (!config.discordServer) {
        console.log('No server specified, disabling Discord integration');
        return false;
    }
    try {
        let server = await client.guilds.fetch(config.discordServer);
    } catch (e) {
        console.log('Alfheim bot is not on the server in question, please click this link to add it, then restart Alfheim: ')
        console.log(`\thttps://discordapp.com/oauth2/authorize?client_id=${config.discordBotID}&scope=bot&permissions=499653680`)
        return false;
    }

    ___initializeDiscord(client, config);
    return true;
}