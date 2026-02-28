import axios from "axios";

const API = axios.create({
  baseURL: "https://naturopathy-backend.onrender.com"
});

// AUTO ATTACH TOKEN
API.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;