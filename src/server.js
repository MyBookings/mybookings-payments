import { Server } from 'ws';
import express from 'express';

const server = express();
const PORT = process.env.PORT || 8000;

server.use((req, res) => {
  res.send('OK!');
});

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

const wss = new Server({ server });

wss.on('connection', (ws) => {

  ws.on('message', (message) => {
    console.log(message);
  });

  ws.on('close', () => console.log('Client disconnected'));

  ws.send('Welcome!');
});


