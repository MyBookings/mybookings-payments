
export const CLIENT_TOKEN = 'E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D';
export const ACCESS_TOKEN = 'C66EF7B239D24632943D115EDE9CB810-EA00F8FD8294692C940F6B5A8F9453D';
export const ORIGIN = 'https://mybookings-payments.herokuapp.com';
export const MAX_AGE = 60 * 60 * 8 // 8 hours

export const url = process.env.ENV === 'production'
  ? 'wss://mybookings-payments.herokuapp.com'
  : 'ws://localhost:8000'