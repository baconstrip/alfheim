import { ServerMessage } from "../../common/messages";

export function connect(message: Function, error: Function): Function {
    const ws = new WebSocket('ws://' + window.location.host + '/gamesocket');
    var lastSeen = new Date();
    ws.onmessage = function (msg) {
        lastSeen = new Date();

        try {
            const data = JSON.parse(msg.data);
            if (data['mAgiC__KEepAlive']) {
                return;
            }
            if (data['error']) {
                error(data);
                return;
            }

            console.log(`Message from Server: ${ServerMessage[data.type]}`)
            console.log(data);
            message(data);
        } catch (e) {
            console.log("Failed to parse JSON from server: " + msg.data);
        }
    };

    setInterval(() => {
        ws.send(JSON.stringify({
            'mAgiC__clIEnTActiVe': true,
        }));
        // TODO change this for actual game
    }, 20_000);
    setInterval(() => {
        // TODO change this for actual game
        if (new Date().getTime() - lastSeen.getTime() > 40_000) {
            console.log('losing connection to server');
            // TODO this should display a warning to the user
        } 
    }, 1000);

    return (x: Object) => {
        ws.send(JSON.stringify(x));
    };
}