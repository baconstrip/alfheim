import fs from 'fs';
import YAML from 'yaml';

export type DiscordChannel = {
    name: string;
    type: "text" | "voice";
}

export class AlfheimConfig {
    public port: number;
    public adminPassword: string;
    public discordEnabled: boolean;
    public discordToken: string;
    public discordServer: string;
    public discordBotID: string;
    public additionalChannels: DiscordChannel[];

    constructor({ port, adminPassword, discordEnable, discordToken, discordServer, discordBotID, additionalChannels}:
        {
            port: number,
            adminPassword: string,
            discordEnable: boolean,
            discordToken: string,
            discordServer: string
            discordBotID: string,
            additionalChannels: DiscordChannel[]
        }) { 
        this.port = port;
        this.adminPassword = adminPassword;
        this.discordEnabled = discordEnable;
        this.discordToken = discordToken;
        this.discordServer = discordServer;
        this.discordBotID = discordBotID;
        this.additionalChannels = additionalChannels;
    }

}

export default ({}): AlfheimConfig => {
    if (!fs.existsSync('config.yml')) {
        fs.copyFileSync('./services/default_config.yml', './config.yml');
    }
    if (!fs.statSync('config.yml').isFile()) {
        throw new Error('config.yml is not a file, must be a file');
    }
        
    const configFile = fs.readFileSync("config.yml", 'utf8');

    let config = YAML.parse(configFile);

    let token: string = "";

    if ('discord-token' in config) {
        // Use JS truthiness to check if this is empty or Undefined.
        if (config['discord-token']) {
            token = config['discord-token'];
        }
    }

    if (!token && config['discord-connection']) {
        token = fs.readFileSync("token.txt", 'utf8');
        console.log(`Found Discord token in token.txt`);
    }

    const channelsConfig = config['additional-channels'];
    let additionalChannels: DiscordChannel[] = new Array();

    
    Object.keys(channelsConfig).forEach((element: any) => {
        const type: string = channelsConfig[element];
        if (typeof(type) != 'string' || (type.toLowerCase() != 'text' && type.toLowerCase() != 'voice')) {
            console.log(`Skipping Discord channel with invalid type: ${type}`)
        }
        additionalChannels.push({name: element, type: channelsConfig[element]})        
    });

    return new AlfheimConfig({
        port: config['port'],
        adminPassword: config['admin-password'],
        discordEnable: config['discord-connection'],
        discordToken: token,
        discordServer: config['discord-server'],
        discordBotID: config['discord-bot-id'],
        additionalChannels: additionalChannels
    });
}