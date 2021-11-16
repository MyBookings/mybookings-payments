import WebSocket from 'ws';

const ws = new WebSocket('wss://ws.mews-demo.com', {
  origin: 'https://mybookings-payments.herokuapp.com',
  headers: {
    'Cookie': 'E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D; AccessToken=C66EF7B239D24632943D115EDE9CB810-EA00F8FD8294692C940F6B5A8F9453D'
  }
});

ws.on('open', (connection) => {
  console.log(connection);
});

ws.on('error', (error) => {
  console.log(error);
});

ws.on('message', (message) => {
  console.log(message);
});


