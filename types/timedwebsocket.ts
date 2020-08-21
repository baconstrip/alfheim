import ws from 'ws';

export class TimedWebSocket extends ws {
    lastMessage: Date = new Date();
}