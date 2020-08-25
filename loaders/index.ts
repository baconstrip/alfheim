import Express from 'express';
import ws from 'ws';

import expressloader from './express';
import wsloader from './ws';
import sqlloader from './sql';
import passport from './passport';
import services from './services';
import { Server } from 'http';
import basicgame from './basicgame';
import worlds from './worlds';

export default async ({ expressApp, wsServer, httpServer } : 
    { 
        expressApp: Express.Application, 
        wsServer: ws.Server,
        httpServer: Server
     }) => {
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
    await worlds({});
    console.log('Loaded worlds from definitions');

    return {
        db: db,
    }
};