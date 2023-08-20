import Express from 'express';
import ws from 'ws';

import expressloader from '../web/express';
import wsloader from '../web/ws';
import sqlloader from '../services/sql';
import passport from './passport';
import services from './services';
import { Server } from 'http';
import basicgame from '../game/language/textprocessing';
import worlds from '../services/worlds';
import compromise from '../game/language/compromise';
import modules from './modules';
import assetresolver from './assetresolver';
import configuration from './configuration';
import discord_startup from './discord_startup';

export default async ({ expressApp, wsServer, httpServer } : 
    { 
        expressApp: Express.Application, 
        wsServer: ws.Server,
        httpServer: Server
     }) => {
    let config = await configuration({});
    await passport({ app: expressApp });
    console.log('Passport started');
    let exp = await expressloader({ app: expressApp });
    console.log('Express initialized');
    await wsloader({ wsServer: wsServer, httpServer: httpServer, sessions: exp });
    console.log('WebSockets initialized');
    let db = await sqlloader({});
    console.log('DB initialized');
    let s = await services({});
    console.log('Loaded services');
    await basicgame({});
    console.log('Loaded base game components');
    await compromise({});
    console.log('Loaded natural language processor');
    await modules({});
    console.log('Loaded extension modules');
    await assetresolver({app: expressApp});
    console.log('Prepared to load assets dynamically');
    if (config.discordEnabled) {
        let success = await discord_startup({config: config}); 
        if (success) {
            console.log('Connected to Discord');
        } else {
            console.log('Failed to connect to Discord')
        }
    } else {
        console.log('Not connecting to Discord');
    }

    return {
        db: db,
        config: config,
    }
};