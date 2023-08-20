import express from 'express';
import ws from 'ws';
import http from 'http';
import services from './services';
// Include the static overworld
import overworld from './worlds/overworld';
import greendungeon from './worlds/greendungeon';
import { Instance } from './game/api/instance/worldinstance';
import instancemanager from './services/instancemanager';

// Required for TypeORM
import "reflect-metadata"
import testing from './testing';
import { runningDev } from './lib/util';

async function startServer() {
    if (runningDev()) {
        testing({});
    }
    console.log('Overworld name: ' + overworld.name);

    const app = express();
    const server = http.createServer(app);
    const socketServer = new ws.Server({noServer: true});


    // Create Overworld landing.
//    const overworldInstance = new Instance(overworld, 'overworld', 1);
//    await instancemanager(overworldInstance);

    const testWorldInstance = new Instance(greendungeon, 'overworld', 1);
    await instancemanager(testWorldInstance);

    // Load server infrastructure.
    const loader = await services({ 
        expressApp: app, 
        wsServer: socketServer,
        httpServer: server
    });
    

    server.listen(loader.config.port, () => {
        console.log(`Server is up on localhost:${loader.config.port}`)
    });
}

startServer();