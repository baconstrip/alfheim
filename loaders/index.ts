import Express from 'express';
import ws from 'ws';

import expressloader from './express';
import wsloader from './ws';

export default async ({ expressApp, wsServer } : { expressApp: Express.Application, wsServer: ws.Server }) => {
    await expressloader({ app: expressApp });
    console.log('Express initialized');
    await wsloader({ wsServer: wsServer });
    console.log('WebSockets initialized');
};