require('dotenv').config();
import WebSocket from 'ws';
import express from 'express';
import axios from 'axios';
import moment from 'moment';
import createMollieClient from '@mollie/api-client';
import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';
import { getEmailTemplate } from 'lib/html-template';
import { connectDB } from 'lib/connect-db';
import { Order } from 'models/Order';
import ngrok from 'ngrok';

const CLIENT_TOKEN = process.env.CLIENT_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const MOLLIE_KEY = process.env.MOLLIE_KEY;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: 'eu-west-2'
});

const transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: '2021-05-04'
  })
});

const WEBSOCKET_URI = 'wss://ws.mews-demo.com/ws/connector';
const GET_ALL_RESERVATIONS_URL = 'https://api.mews-demo.com/api/connector/v1/reservations/getAll';
const GET_PRICE_RESERVATIONS_URL = 'https://api.mews-demo.com/api/connector/v1/reservations/price';

const PORT = process.env.PORT || 8000;
const app = express();

app.get('/', (req, res) => res.status(200).send('OK'));
app.get('/api/webhook', (req, res) => res.status(200).send('OK'));
app.get('/orders/:id', (req, res) => res.status(200).send('OK'));
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
  if (!events) return;

  const reservationEvents = events.every(event => event.Type === 'Reservation');
  if (!reservationEvents) return;

  const confirmedEvents = events.filter(event => event.State === 'Confirmed');
  if (!confirmedEvents[0]) return; 

  const eventIds = confirmedEvents.map(event => event.Id);

  const { data: { Reservations, Rates, Customers } } = await axios({
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
        Customers: true,
      }
    },
  });

  // const newReservations = Reservations.every(reservation => {
  //   let created = moment(reservation.CreatedUtc);
  //   let updated = moment(reservation.UpdatedUtc);
  //   let difference = updated.diff(created, 'seconds');
  //   if (difference > 2) return false;
  //   return true;
  // });

  // if (!newReservations) return;

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

  const totalValue = parseFloat(ReservationPrices[0].Total.Value);
  if (!totalValue) return;

  const currency = ReservationPrices[0].Total.Currency;

  const customerEmail = Customers[0].Email;
  if (!customerEmail) return;

  await connectDB();

  const order = await Order.create({
    status: 'open',
    email: customerEmail,
    reservation_ids: [...eventIds],
    service_id: serviceId,
    total_value: totalValue,
    currency: currency,
  });

  const orderId = order._id;

  const mollieClient = await createMollieClient({
    apiKey: MOLLIE_KEY,
  });

  const ngrokTunnel = process.env.NODE_ENV === 'production'
    ? null
    : await ngrok.connect(8000)

  const url = process.env.NODE_ENV === 'production'
    ? 'https://innerlijk-werk.nl'
    : ngrokTunnel
  
  const payment = await mollieClient.payments.create({
    amount: {
      value: totalValue.toFixed(2),
      currency: 'EUR',
    },
    method: 'ideal',
    description: 'My first API payment',
    redirectUrl: `${url}/orders/${orderId}`,
    webhookUrl: `${url}/api/webhook`,
    metadata: {
      orderId: orderId,
    },
  });

  await order.set({ payment_id: payment.id });
  await order.save();

  const checkoutUrl = await payment.getCheckoutUrl();

  const html = getEmailTemplate({ url: checkoutUrl, totalValue, });

  const res = await transporter.sendMail({
    from: 'sancus88@protonmail.com',
    to: 'luuk@mybookings.com',
    subject: 'Payment link',
    html: html,
  });
});

ws.on('close', () => {
  console.log('disconnected');
});

ws.on('error', (error) => {
  console.log(error);
});

