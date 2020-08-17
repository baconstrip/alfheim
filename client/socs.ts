export function connect() {
    const ws = new WebSocket('ws://' + window.location.host + '/test');
    ws.onmessage = function(msg) {
        console.log(msg.data);
    };
}