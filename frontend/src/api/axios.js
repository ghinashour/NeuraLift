// src/api/axios.js
import axios from "axios";

// ✅ Base instance for user requests
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`, // All normal routes go through /api
});

// ✅ Base instance for admin requests
const AdminAPI = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/admin`, // Fixed template string
});

// ✅ Interceptor to attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

AdminAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ------------------- Normal User APIs -------------------

// ✅ Mood APIs
export const getMoods = async () => {
  const response = await API.get("/moods");
  return response.data;
};

export const addMood = async (moodData) => {
  const response = await API.post("/moods", moodData);
  return response.data;
};

// ✅ Event APIs
export const createEvent = (eventData) => API.post("/events", eventData);
export const getEvents = () => API.get("/events");
export const updateEvent = (id, eventData) => API.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// ✅ User info
export const getCurrentUser = () => API.get("/auth/me");

// ✅ Quotes
export const getRandomQuote = () => API.get("/quotes/random");

// ------------------- Admin APIs -------------------
export const getAllUsers = () => AdminAPI.get("/users");
export const getAllMoods = () => AdminAPI.get("/moods");
export const getAllSchedules = () => AdminAPI.get("/schedules");
export const getAllNotes = () => AdminAPI.get("/notes");
export const getAllTasks = () => AdminAPI.get("/tasks");
export const getAllSuccessStories = () => AdminAPI.get("/success-stories");

export const toggleFeatureStory = (id) => AdminAPI.put(`/success-stories/feature/${id}`);
export const getStoryAnalytics = () => AdminAPI.get("/success-stories/analytics/stats");

// ✅ Export the configured instances
export default API;
export { AdminAPI };
