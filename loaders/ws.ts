import ws from 'ws';

export default async ({ wsServer } : { wsServer: ws.Server }) => {
    wsServer.on('connection', (soc: ws) =>{
        soc.on('message', (message: string) => {
            console.log('message from client: ' + message);
            soc.send('Hello thar ' + message);
        });

        soc.send('Connected to server. Welcome');
    });
}