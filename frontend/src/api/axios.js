//all requests automatically include the JWT token if it exists in localStorage
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
});

// Add token to request headers if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
