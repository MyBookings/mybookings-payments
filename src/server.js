import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 8000;

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {

  ws.on('message', (message) => {
    console.log(message);
  });

  ws.send('Welcome!');
});


