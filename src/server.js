import { serialize } from 'cookie';
import { client as WebSocketclient } from 'websocket';

const CLIENT_TOKEN = 'E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D';
const ACCESS_TOKEN = 'C66EF7B239D24632943D115EDE9CB810-EA00F8FD8294692C940F6B5A8F9453D';

const token = {
  ClientToken: CLIENT_TOKEN,
  AccessToken: ACCESS_TOKEN,
};

const cookie = serialize('token', token, {
  httpOnly: true,
  secure: true,
  path: '/',
  sameSite: 'lax',
})

const client = new WebSocketclient();

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
  'origin': 'https://mews-websocket.herokuapp.com',
  'headers': {
    'Cookie': cookie,
  }
});