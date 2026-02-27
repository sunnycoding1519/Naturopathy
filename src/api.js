import axios from "axios";

const API = axios.create({
  baseURL: "https://naturopathy-backend.onrender.com"
});

/* =========================
   AUTO TOKEN ATTACH ⭐
========================= */
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;