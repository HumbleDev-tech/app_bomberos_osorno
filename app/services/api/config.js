// app/services/api/config.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://18.117.109.85/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;