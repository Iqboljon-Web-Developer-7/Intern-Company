import axios from "axios";

const api = axios.create({
  baseURL: "http://45.138.158.137:92/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
