import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: process.env.PORT || 8000 });

wss.on('connection', (ws) => {

  ws.on('message', (message) => {
    console.log(JSON.parse(message));
  });

  ws.send(JSON.stringify('WELCOME!!!'));
});