//all requests automatically include the JWT token if it exists in localStorage
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000", // backend base URL
});

// Add token to request headers if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ------- Event APIs -------
export const createEvent = (eventData) => API.post("/events", eventData);
export const getEvents = () => API.get("/events");
export const updateEvent = (id, eventData) => API.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => API.delete(`/events/${id}`);


export default API;
