import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8000", // backend PHP
  headers: {
    "Content-Type": "application/json"
  }
});

export default http;
