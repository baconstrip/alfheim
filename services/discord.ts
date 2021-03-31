import * as discord from 'discord.js';
import { every, xor } from 'lodash';
import game from '../api/routes/game';
import { AlfheimConfig, DiscordChannel } from '../loaders/configuration';
import instancemanager, { ListInstances } from './instancemanager';
import { ListPlayers } from './players';

// How often the Discord connector will refresh the server to ensure that 
// everything is synchronized, in ms.
const discordTickRate = 15000;

const builtinChannels: DiscordChannel[] = [
    {name: 'lobby', type: 'voice'},
]

class DiscordManager {
    public client: discord.Client;
    public config: AlfheimConfig;

    constructor(client: discord.Client, config: AlfheimConfig) {
        this.client = client;
        this.config = config;

        setInterval(() => {this.synchronize()}, discordTickRate);
        this.synchronize();
    }

    async currentGuild(): Promise<discord.Guild> {
        return this.client.guilds.fetch(this.config.discordServer);
    }

    async synchronizeRoles(): Promise<null> {
        return new Promise<null>(async (resolve) => {
            resolve(null);
        });
    }

    async synchronizeChannels(): Promise<null> {
        return new Promise<null>(async (resolve) => {
            let requiredChannels: DiscordChannel[] = new Array();
            let gameChannels: DiscordChannel[] = new Array();

            ListInstances().forEach(inst => {
                inst.rooms.forEach(room => {
                    gameChannels.push({
                        name: `${inst.instName}-${room.forRoom.name}`,
                        type: "voice",
                    });
                });
            });

            // Add additional channels from config and the built in channels.
            this.config.additionalChannels.forEach((x) => requiredChannels.push(x));
            builtinChannels.forEach((x) => requiredChannels.push(x));
            gameChannels.forEach((x) => requiredChannels.push(x));
            let requiredNames = requiredChannels.map(x => x.name.toLowerCase());
            
            let guild = await this.currentGuild();
            let foundChannels: string[] = new Array();
            guild.channels?.cache?.forEach(async (chan) => {
                if (!requiredNames.includes(chan.name.toLowerCase())) {
                    chan.delete("Alfheim automatically deleting channel that is no longer required");
                    console.log(`Deleting Discord channel ${chan.name}, as it is not required`);
                    return;
                }

                let expectedType = requiredChannels.find(x => x.name.toLowerCase() == chan.name.toLowerCase())?.type;
                if ((chan.isText() && expectedType == 'voice') || (chan.type == 'voice' && expectedType == 'text') || (chan.type != 'voice' && chan.type != 'text')) {
                    await chan.delete("Alfheim deleting channel of incorrect type");
                    console.log(`Deleting discord channel ${chan.name}, as it is the incorrect type of channel.`)
                    return;
                }

                foundChannels.push(chan.name.toLowerCase());
            });

            requiredChannels.forEach(async (chan) => {
                if (!foundChannels.includes(chan.name.toLowerCase())) {
                    guild.channels.create(chan.name, {
                        type: chan.type,
                        position: 999,
                        reason: 'Alfheim automatically creating channel.',
                    });
                }
            });

            let gameChannelNames = gameChannels.map((x) => x.name.toLowerCase());
            let everyoneRole = guild.roles.cache?.find(x => x.name == '@everyone');
            guild.channels?.cache?.forEach(async (chan) => {
                if (everyoneRole) {
                    if (gameChannelNames.includes(chan.name.toLowerCase())) {
                        if (chan.permissionsFor(everyoneRole)?.has('VIEW_CHANNEL').valueOf() === false &&
                            chan.permissionsFor(everyoneRole)?.has('CONNECT').valueOf() === false 
                        ) {
                            return;
                        }
                        chan.updateOverwrite(everyoneRole, {'VIEW_CHANNEL': false, 'CONNECT': false})
                    }
                }
            });
            
            resolve(null);
        });
    }

    async synchronizeUsers(): Promise<null> {
        return new Promise(async resolve => {
            let guild = await this.currentGuild();

            let channels: discord.GuildChannel[] = new Array();
            // Collect all the channels so we can search them.
            guild.channels.cache.forEach(chan => {
                channels.push(chan);
            });


            let users: discord.GuildMember[] = new Array();
            (await guild.members.fetch()).forEach(member => users.push(member));

            ListPlayers().forEach((ply) => {
                const discordName = ply.authUser.discordname.toLowerCase();

            })
            
            resolve(null);
        });
    }

    async synchronize() {
        this.synchronizeRoles();
        this.synchronizeChannels();
    }
}

let ___inst: DiscordManager;

export function ___initializeDiscord(client: discord.Client, config: AlfheimConfig) {
    ___inst = new DiscordManager(client, config);
}

export async function ___currentGuild() {
    return ___inst.currentGuild();
}

/**
 * Updates voice channels to the expected values immediately (although does not
 * wait for them to be updated). Returns an empty promise.
 */
export async function UpdateRooms(): Promise<null> {
    return ___inst.synchronizeChannels();
}