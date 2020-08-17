import express from 'express';
import ws from 'ws';
import http from 'http';
import loaders from './loaders';

const PORT = 8054;

async function startServer() {
    
    const app = express();
    const server = http.createServer(app);
    const socketServer = new ws.Server({server});

    await loaders({ expressApp: app, wsServer: socketServer });

    server.listen(PORT, () => {
        console.log('Server is up...')
    });
}

startServer();