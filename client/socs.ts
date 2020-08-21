export function connect(message: Function, error: Function): Function {
    const ws = new WebSocket('ws://' + window.location.host + '/test');
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

            console.log('message from server:');
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
        // FOR DEVELOPMENT ONLY
    }, 1000);
    setInterval(() => {
        if (new Date().getTime() - lastSeen.getTime() > 3000) {
            console.log('losing connection to server');
        } 
    }, 1000);

    return (x: Object) => {
        ws.send(JSON.stringify(x));
    };
}