import { io } from "socket.io-client";

// Attach token from localStorage at connection time so server can authenticate socket
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const socket = io("http://localhost:4000", {
  transports: ["websocket"],
  auth: token ? { token } : undefined,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;
