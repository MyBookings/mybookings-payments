require('dotenv').config();
import WebSocket from 'ws';
import express from 'express';
import axios from 'axios';
import moment from 'moment';
// import createMollieClient from '@mollie/api-client';

const CLIENT_TOKEN = process.env.CLIENT_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const MOLLIE_KEY = process.env.MOLLIE_KEY;

const WEBSOCKET_URI = 'wss://ws.mews-demo.com/ws/connector';
const GET_ALL_RESERVATIONS_URL = 'https://api.mews-demo.com/api/connector/v1/reservations/getAll';
const GET_PRICE_RESERVATIONS_URL = 'https://api.mews-demo.com/api/connector/v1/reservations/price';

const PORT = process.env.PORT || 8000;
const app = express();

app.get('/', (req, res) => res.status(200).send('OK'));
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
  
const ws = new WebSocket(
  WEBSOCKET_URI,
  [],
  {
    'headers': {
      'Cookie': `ClientToken=${CLIENT_TOKEN}; AccessToken=${ACCESS_TOKEN}`
    }
  }
);

ws.on('open', () => {
  console.log('connected');
});

ws.on('message', async (message) => {
  
  const parsed = JSON.parse(message);
  console.log(parsed);
  const events = parsed.Events?.map(event => event);

  const reservationEvents = events.every(event => event.Type === 'Reservation');
  if (!events || !reservationEvents) return;

  const confirmedEvents = events.filter(event => event.State === 'Confirmed');
  if (!confirmedEvents[0]) return; 

  const eventIds = confirmedEvents.map(event => event.Id);

  const { data: { Reservations, Rates } } = await axios({
    method: 'post',
    url: GET_ALL_RESERVATIONS_URL,
    data: {
      ClientToken: CLIENT_TOKEN,
      AccessToken: ACCESS_TOKEN,
      Client: 'Sample Client 1.0.0',
      ReservationIds: [...eventIds],
      Currency: 'EUR',
      Extent: {
        Reservations: true,
        Rates: true,
      }
    },
  });

  const newReservations = Reservations.every(event => {
    let created = moment(event.CreatedUtc);
    let updated = moment(event.UpdatedUtc);
    let difference = updated.diff(created, 'seconds');
    if (difference > 2) return false;
    return true;
  });

  if (!newReservations) return;

  const rateIds = Reservations.map(reservation => reservation.RateId);

  const rates = rateIds.map(rateId => {
    return Rates.find(rate => {
      return rate.Id === rateId;
    });
  });

  const serviceId = [...new Set(rates.map(rate => rate.ServiceId))][0];

  const { data: { ReservationPrices } } = await axios({
    method: 'post',
    url: GET_PRICE_RESERVATIONS_URL,
    data: {
      ClientToken: CLIENT_TOKEN,
      AccessToken: ACCESS_TOKEN,
      Client: 'Sample Client 1.0.0',
      ServiceId: serviceId,
      Reservations: [...Reservations],
    },
  });

  console.log(ReservationPrices[0].Total.Value);

  

  // const mollieClient = await createMollieClient({
  //   apiKey: MOLLIE_KEY,
  // });

});

ws.on('close', () => {
  console.log('disconnected');
});

ws.on('error', (error) => {
  console.log(error);
});

