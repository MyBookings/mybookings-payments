import express from 'express';
import { serialize } from 'cookie';
import { client as WebSocketclient } from 'websocket';
import { CLIENT_TOKEN, ACCESS_TOKEN } from './config';

const client = new WebSocketclient();
const PORT = process.env.PORT || 3000;
const app = express();

app.get('*', (req, res) => {

  client.on('connectFailed', (error) => {
    console.log(error);
  });
  
  client.on('connect', (connection) => {
    console.log(connection);
  });
  
  client.on('message', (message) => {
    console.log(message);
  });
  
  client.connect('wss://ws.mews-demo.com', {
    'origin': 'https://mybookings-payments.herokuapp.com',
    'headers': {
      'Cookie': 'ClientToken=E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D; AccessToken=C66EF7B239D24632943D115EDE9CB810-EA00F8FD8294692C940F6B5A8F9453D',
    }
  });

  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

