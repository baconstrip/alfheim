import express from 'express';
import ws from 'ws';
import http from 'http';
import loaders from './loaders';
// Include the static overworld
import overworld from './worlds/overworld';
import { Instance } from './types/game/worldinstance';
import instancemanager from './services/instancemanager';

// Required for TypeORM
import "reflect-metadata"
import testing from './testing';

const PORT = 8054;

async function startServer() {
    const dev = process.env.NODE_ENV === "development";
    if (dev) {
        testing({});
    }
    console.log('Overworld name: ' + overworld.name);

    const app = express();
    const server = http.createServer(app);
    const socketServer = new ws.Server({noServer: true});

    // Load server infrastructure.
    await loaders({ 
        expressApp: app, 
        wsServer: socketServer,
        httpServer: server
    });
    
    // Create Overworld landing.
    const overworldInstance = new Instance(overworld, 'overworld', 1);
    await instancemanager(overworldInstance);

    server.listen(PORT, () => {
        console.log('Server is up...')
    });
}

startServer();