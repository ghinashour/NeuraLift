import { io } from "socket.io-client";

// Attach token from localStorage at connection time so server can authenticate socket
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

// REACT_APP_API_URL is like https://xxx.onrender.com (no /api).
// Socket.io must hit the backend origin, so strip any trailing /api.
const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:4000").replace(/\/api\/?$/, "").replace(/\/$/, "");

const socket = io(API_ORIGIN, {
  transports: ["polling", "websocket"],
  auth: token ? { token } : undefined,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;
