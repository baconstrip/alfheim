import * as discord from 'discord.js';
import { AlfheimConfig, DiscordChannel } from '../loaders/configuration';
import Player from '../types/game/player';
import RoomInstance from '../types/game/roominstance';
import { Instance } from '../types/game/worldinstance';
import instancemanager, { ListInstances } from './instancemanager';
import { ListPlayers } from './players';
import { GuildTextBasedChannel } from 'discord.js';
import { GuildChannel } from 'discord.js';

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

    async synchronizeRoles(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            resolve();
        });
    }

    roomName(inst: Instance | undefined, room: RoomInstance | undefined): string {
        if (!inst || !room) {
            return 'ERROR-ERROR';
        }
        return `${inst?.instName}-${room?.forRoom.name}`;
    }

    async synchronizeChannels(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            let requiredChannels: DiscordChannel[] = new Array();
            let gameChannels: DiscordChannel[] = new Array();

            ListInstances().forEach(inst => {
                inst.rooms.forEach(room => {
                    gameChannels.push({
                        name: this.roomName(inst, room),
                        type: "voice",
                    });
                });
            });

            // Add additional channels from config and the built in channels.
            this.config.additionalChannels.forEach((x) => requiredChannels.push(x));
            builtinChannels.forEach((x) => requiredChannels.push(x));
            gameChannels.forEach((x) => requiredChannels.push(x));
            let requiredNames = requiredChannels.map(x => x.name.toLowerCase());
            
            let guild = await (this.currentGuild().catch(x => reject(`Failed to access discord, are you sure you've set up your connection properly? Error: ${JSON.stringify(x)}`))) as discord.Guild;
            let foundChannels: string[] = new Array();

            for (const [_, chan] of guild.channels.cache) {
                if (!requiredNames.includes(chan.name.toLowerCase())) {
                    await chan.delete("Alfheim automatically deleting channel that is no longer required").catch(x => reject(x));
                    console.log(`Deleting Discord channel ${chan.name}, as it is not required`);
                }

                let expectedType = requiredChannels.find(x => x.name.toLowerCase() == chan.name.toLowerCase())?.type;
                if ((chan.isTextBased() && expectedType == 'voice') || (chan.isVoiceBased() && expectedType == 'text') || (!chan.isVoiceBased() && !chan.isTextBased())) {
                    await chan.delete("Alfheim deleting channel of incorrect type").catch(x => reject(x));
                    console.log(`Deleting discord channel ${chan.name}, as it is the incorrect type of channel.`)
                }

                foundChannels.push(chan.name.toLowerCase());
            }

            const everyoneRole = guild.roles.cache?.find(x => x.name == '@everyone');
            const botMember = guild.members.resolve(this.config.discordBotID);

            if (!everyoneRole) {
                throw new Error(`Couldn't find everyone role.`);
            }

            if (!botMember) {
                throw new Error(`Couldn't find member for bot.`);
            }

            for (const chan of requiredChannels) {
                if (!foundChannels.includes(chan.name.toLowerCase())) {
                    var channelType = chan.type == 'voice' ? discord.ChannelType.GuildVoice : discord.ChannelType.GuildText;
                    await guild.channels.create({
                        name: chan.name,
                        type: channelType,
                        position: 999,
                        reason: 'Alfheim automatically creating channel.',
                        // permissionOverwrites: [
                        //     {
                        //         id: everyoneRole,
                        //         deny: ['VIEW_CHANNEL', 'CONNECT'],
                        //     },
                        //     {
                        //         id: botMember,
                        //         allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'SEND_MESSAGES', 'CONNECT'],
                        //     }
                        // ],
                    }).catch(x => reject(x));
                }
            }

            let gameChannelNames = gameChannels.map((x) => x.name.toLowerCase());

            

            for (const [_, chan] of guild.channels.cache) {
                if (everyoneRole) {
                    if (gameChannelNames.includes(chan.name.toLowerCase())) {
                        var viewChannel = discord.PermissionsBitField.Flags.ViewChannel;
                        var connect = discord.PermissionsBitField.Flags.Connect;
                        if (chan.permissionsFor(everyoneRole)?.has(viewChannel).valueOf() === false &&
                            chan.permissionsFor(everyoneRole)?.has(connect).valueOf() === false
                        ) {
                            continue;
                        }
                        if (botMember){
                            (chan as GuildChannel).permissionOverwrites.create(botMember, { ViewChannel: true, ManageChannels: true, SendMessages: true, Connect: true}).then(_ => {
                                if (everyoneRole) {
                                    (chan as GuildChannel).permissionOverwrites.create(everyoneRole, { ViewChannel: false, Connect: false })
                                }
                            });
                        }
                        
                    }
                }
            }
            
            resolve();
        });
    }

    async synchronizeUsers(): Promise<void> {
        return new Promise(async resolve => {
            // TODO: make this not suck for API calls and performance.
            for (const ply of ListPlayers()) {
                this.synchronizePlayer(ply);
            }
        });
    }

    async locatePlayer(ply: Player): Promise<discord.GuildMember | undefined> {
        return new Promise(async (resolve, reject) => {
            await this.currentGuild().catch(x => reject(`Couldn't reach Discord`)).then(g => {
                const guild = g as discord.Guild; 
                const user = guild.members.cache.find(x => x.user.tag == ply.authUser.discordname);
                if (user) {
                    resolve(user);
                } else {
                    reject("User not found")
                }
                return;
            });
        });
    }

    async synchronizePlayer(ply: Player): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const user = await this.locatePlayer(ply);
            if (!user) {
                return reject('player not found on Discord');
            } 

            const roomName = this.roomName(ply.location?.fromWorld, ply.location);
            if (!user?.voice.channel) {
                return reject('player not in voice');
            }

            if (user?.voice.channel?.name == roomName) {
                return resolve();
            }

            await this.currentGuild().then(g => {
                const guild = g as discord.Guild;
                const chan = guild.channels.cache.find(x => x.name == roomName);
                if (!chan) {
                    return reject(`cannot find the appropriate channel ${roomName}`);
                }
                
                user?.voice.setChannel(chan as discord.GuildVoiceChannelResolvable);
            });
        });
    }

    async synchronize() {
        const roles = this.synchronizeRoles();
        const channels = this.synchronizeChannels();
        const users = this.synchronizeUsers();

        await roles.catch(x => { console.log(`Failed to synchronize to discord: ${x}`) });
        await channels.catch(x => { console.log(`Failed to synchronize channels to discord: ${JSON.stringify(x)}`) });
        await users.catch(x => { console.log(`Failed to synchronize users to discord: ${x}`) });
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
 * Updates voice channels to the expected values immediately, returning a 
 * promise that is resolved once the operations are completed.
 */
export async function UpdateDiscordRooms(): Promise<void> {
    return ___inst.synchronizeChannels();
}

/**
 * Updates a player's location immediately, returning a promise that is
 * resolved once they are moved. If there is a problem with the player, the
 * promise will be rejected.
 * 
 * @param ply player object for the player in question
 * @returns a promise that resolves once they are moved.
 */
export async function UpdateDiscordUser(ply: Player): Promise<void> {
    return ___inst.synchronizePlayer(ply);
}

export async function ___updateDiscordPlayerAndRooms(ply: Player): Promise<void> {
    return ___inst.synchronizeChannels().then(() => {___inst.synchronizePlayer(ply)});
}