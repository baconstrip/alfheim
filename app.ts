import express from 'express';
import ws from 'ws';
import http from 'http';
import loaders from './loaders';

// Required for TypeORM
import "reflect-metadata"

const PORT = 8054;

async function startServer() {
    
    const app = express();
    const server = http.createServer(app);
    const socketServer = new ws.Server({server});

    let services = await loaders({ 
        expressApp: app, 
        wsServer: socketServer,
        httpServer: server
    });

    server.listen(PORT, () => {
        console.log('Server is up...')
    });
}

startServer();