import API from "./axios";

// Signup request
export const signup = (formData) => API.post("/auth/signup", formData);

// Login request
export const login = (formData) => API.post("/auth/login", formData);
