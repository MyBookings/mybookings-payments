import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8000 });

wss.on('connection', (ws) => {

  ws.on('message', (message) => {
    console.log(message);
  });

  ws.send('Welcome!');
});


