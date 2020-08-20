import ws from 'ws';
import { Server, ClientRequest } from 'http';
import { Duplex } from 'stream';
import { AlfEvent } from '../types/events';
import { EventBus } from '../services/eventbus';

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
            EventBus.dispatch(AlfEvent.RAW_MESSAGE_IN, message);
            soc.lastMessage = new Date();
            try {
                var data = JSON.parse(message);
                if (data['mAgiC__clIEnTActiVe']) {
                    soc.send(JSON.stringify({
                        'mAgiC__KEepAlive': true,
                    }));
                    return;
                }
                EventBus.dispatch(AlfEvent.MESSAGE_IN, data);
                console.log('message from client: ' + message);
            } catch (e) {
                console.log('Failed to parse message from client as JSON: ' + message);
            }
        });

        soc.lastMessage = new Date();
        soc.on('pong', () => {
            soc.lastMessage = new Date();
        });

        soc.send(JSON.stringify({greeting: 'Connected to server. Welcome' }));
        console.log("greeting client");
    });

    setInterval(() => {
        wsServer.clients.forEach(function(soc) {
            soc.ping('ping');
        });
    }, 1000);

    setInterval(() => {
        wsServer.clients.forEach((soc: ws) => {
            let last = (soc as TimedWebSocket).lastMessage;
            if (new Date().getTime() - last.getTime() > 10000) {
                soc.terminate();
                console.log('lost connection to ' + soc.url);
            }
        });
    }, 1000);
}