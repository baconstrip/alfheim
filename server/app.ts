import express from 'express';
import ws from 'ws';
import http from 'http';
import loaders from './loaders';
// Include the static overworld
import overworld from './worlds/overworld';
import greendungeon from './worlds/greendungeon';
import { Instance } from './game/worldinstance';
import instancemanager from './services/instancemanager';

// Required for TypeORM
import "reflect-metadata"
import testing from './testing';

async function startServer() {
    const dev = process.env.NODE_ENV === "development";
    if (dev) {
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
    const loader = await loaders({ 
        expressApp: app, 
        wsServer: socketServer,
        httpServer: server
    });
    

    server.listen(loader.config.port, () => {
        console.log(`Server is up on localhost:${loader.config.port}`)
    });
}

startServer();