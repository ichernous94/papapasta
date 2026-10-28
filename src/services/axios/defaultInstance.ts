import axios from 'axios';

const defaultInstance = axios.create({
  baseURL: process.env.API as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default defaultInstance;
