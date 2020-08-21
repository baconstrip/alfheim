import ws from 'ws';
import { Server, ClientRequest } from 'http';
import { Duplex } from 'stream';
import { AlfEvent } from '../types/events';
import { EventBus } from '../services/eventbus';
import { TimedWebSocket } from '../types/timedwebsocket';
import { LookupPlayerId } from '../services/players';


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
                return;
            }
            wsServer.handleUpgrade(request as any, socket as any, head, function (ws) {
                wsServer.emit('connection', ws, request);
            });
        });
    });
    // When clients connect, greet them and register echo listener.
    wsServer.on('connection', (soc: TimedWebSocket, req: any) =>{
        const id = req.session.passport.user;
        EventBus.dispatch(AlfEvent.PLAYER_JOIN_LIVE, {id: id, soc: soc});

        // Add message reciever behaviour
        soc.on('message', (message: string) => {
            const ply = LookupPlayerId(id);
            EventBus.dispatch(AlfEvent.RAW_MESSAGE_IN, {ply: ply, message: message});
            soc.lastMessage = new Date();
            try {
                var data = JSON.parse(message);
                if (data['mAgiC__clIEnTActiVe']) {
                    soc.send(JSON.stringify({
                        'mAgiC__KEepAlive': true,
                    }));
                    return;
                }
                // Only transmit events with type set.
                if (data['type'] !== undefined){
                    EventBus.dispatch(AlfEvent.MESSAGE_IN, {ply: ply, message: data});
                }
                console.log('message from client: ' + message);
            } catch (e) {
                if (e instanceof SyntaxError) { 
                    console.log('Failed to parse message from client as JSON: ' + message);
                } else {
                    throw e;
                }
            }
        });

        // Update last Message when connecting
        soc.lastMessage = new Date();

        // Add pong updater to client.
        soc.on('pong', () => {
            soc.lastMessage = new Date();
        });

        // Greet the client
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