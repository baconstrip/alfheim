import ws from 'ws';
import { Server, ClientRequest } from 'http';
import { Duplex } from 'stream';

class TimedWebSocket extends ws {
    lastMessage: Date = new Date();
}

export default async ({ wsServer, httpServer, sessions } : 
        { 
            wsServer: ws.Server, 
            httpServer: Server,
            sessions: any
        }) => {
    httpServer.on('upgrade', (request: ClientRequest, socket: Duplex, head: Buffer) => {
        sessions(request, {}, () => {
            const session = (request as any).session;
            if (!session.passport) {
                console.log('breaking unathenticated socket');
                socket.destroy();
            }
        });
    });
    // When clients connect, greet them and register echo listener.
    wsServer.on('connection', (soc: TimedWebSocket) =>{
        soc.on('message', (message: string) => {
            soc.lastMessage = new Date();
            console.log('message from client: ' + message);
            soc.send('Hello thar ' + message);
        });

        soc.lastMessage = new Date();
        soc.on('pong', () => {
            soc.lastMessage = new Date();
        });

        soc.send('Connected to server. Welcome');
    });

    setInterval(() => {
        wsServer.clients.forEach(function(soc) {
            soc.ping('ping');
        });
    }, 1000);

    setInterval(() => {
        wsServer.clients.forEach((soc: ws) => {
            console.log((soc as TimedWebSocket).lastMessage);
            let last = (soc as TimedWebSocket).lastMessage;
            if (new Date().getTime() - last.getTime() > 10000) {
                soc.terminate();
                console.log('lost connection to ' + soc.url);
            }
        });
    }, 1000);
}