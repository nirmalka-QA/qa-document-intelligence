import axios from "axios";

// Strictly pointing to the local FastAPI server
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;