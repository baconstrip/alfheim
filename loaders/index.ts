import Express from 'express';
import ws from 'ws';

import expressloader from './express';
import wsloader from './ws';
import sqlloader from './sql';
import passport from './passport';
import { Server } from 'http';

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

    return {
        db: db,
    }
};