//all requests automatically include the JWT token if it exists in localStorage
import axios from "axios";


//the api used for normal users
const API = axios.create({
  baseURL: "http://localhost:4000", 
});

//admin api 
const AdminAPI = axios.create({
  baseURL: "http://localhost:4000/api/admin",
});

// Add token to request headers if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// -------Normal Users Event APIs -------
export const createEvent = (eventData) => API.post("/events", eventData);
export const getEvents = () => API.get("/events");
export const updateEvent = (id, eventData) => API.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// ---------- Admin APIs ----------
export const getAllUsers = () => AdminAPI.get("/users");
export const getAllMoods = () => AdminAPI.get("/moods");
export const getAllSchedules = () => AdminAPI.get("/schedules");
export const getAllNotes = () => AdminAPI.get("/notes");
export const getAllTasks = () => AdminAPI.get("/tasks");
export const getAllSuccessStories = () => AdminAPI.get("/success-stories");

// Example: feature/unfeature story
export const toggleFeatureStory = (id) => AdminAPI.put(`/success-stories/feature/${id}`);

// Analytics
export const getStoryAnalytics = () => AdminAPI.get("/success-stories/analytics/stats");
//get the current user from our database
export const getCurrentUser = () => API.get("/api/auth/me");
// Fetch a random quote from backend
export const getRandomQuote = () => API.get("/api/quotes/random");

export default API;
export {AdminAPI};