import express from 'express';
import { serialize } from 'cookie';
import { client as WebSocketclient } from 'websocket';
import { CLIENT_TOKEN, ACCESS_TOKEN } from './config';

const token = {
  ClientToken: CLIENT_TOKEN,
  AccessToken: ACCESS_TOKEN,
};

export const MAX_AGE = 60 * 60 * 8 // 8 hours

const cookie = serialize('Cookie', token, {
  maxAge: MAX_AGE,
  expires: new Date(Date.now() + MAX_AGE * 1000),
  httpOnly: true,
  secure: true,
  path: '/',
});

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
      'set-cookie': cookie,
    }
  });

  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

