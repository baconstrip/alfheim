import ws from 'ws';
import { Server, ClientRequest } from 'http';
import { Duplex } from 'stream';
import { InternalEvent } from '../events/internalevent';
import { InternalEventBus } from '../events/internalevents';
import { TimedWebSocket } from '../lib/timedwebsocket';
import players, { LookupPlayerID } from '../game/player/players';


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
        console.log('new connection');
        const id = req.session.passport.user;
        InternalEventBus.dispatch(InternalEvent.PLAYER_JOIN_LIVE, {id: id, soc: soc});

        InternalEventBus.dispatch(InternalEvent.POST_PLAYER_JOIN_LIVE, LookupPlayerID(id));

        // Add message reciever behaviour
        soc.on('message', (message: string) => {
            const ply = LookupPlayerID(id);
            InternalEventBus.dispatch(InternalEvent.RAW_MESSAGE_IN, {ply: ply, message: message});
            soc.lastMessage = new Date();
            try {
                var data = JSON.parse(message);
                if (data['mAgiC__clIEnTActiVe']) {
                    soc.send(JSON.stringify({
                        'mAgiC__KEepAlive': true,
                    }));
                    return;
                }
                if (!data) {
                    console.log(`Bad message from player: ${data}`);
                    return;
                }
                // Only transmit events with type set.
                if (data['type'] !== undefined){
                    InternalEventBus.dispatch(InternalEvent.MESSAGE_IN, {ply: ply, message: data});
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

        soc.on('close', () => {
            InternalEventBus.dispatch(InternalEvent.PLAYER_DISCONNECT_LIVE, LookupPlayerID(id));
            console.log('Player disconnected: ' + id);
            const userTimeout = 10 * 1000;
            // Set a timer to clean up the user and reset them.
            const cancel = setTimeout(() => {
                console.log('Forgetting user: ' + id);
                InternalEventBus.dispatch(InternalEvent.PLAYER_CLEANUP, id);
            }, userTimeout);
            // Cancel the timer if the user rejoins quickly enough by adding
            // another listener.
            const eventCancel = InternalEventBus.onEvent(InternalEvent.PLAYER_JOIN_LIVE, (x: any) => {
                clearTimeout(cancel);
            });
            // Cancel the above listener after the timeout to avoid creating
            // excess listeners.
            setTimeout(() => {
                eventCancel();
            }, userTimeout);
        });

        // Update last Message when connecting
        soc.lastMessage = new Date();

        // Add pong updater to client.
        soc.on('pong', () => {
            soc.lastMessage = new Date();
        });
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