import axios from "axios";

export const API_URL = 'https://zignuts.dev/quotebuddy-api/api/v2/';

export default axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})