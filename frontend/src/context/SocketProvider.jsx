import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 🚫 If no user or token, disconnect socket if exists
    if (!user || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      console.log("❌ No user or token, socket not initialized");
      return;
    }

    console.log("🔗 Connecting socket for user:", user?._id);

    // ✅ Connect to backend with token authentication
    const SOCKET_URL = (process.env.REACT_APP_API_URL || "http://localhost:4000").replace(/\/api\/?$/, "").replace(/\/$/, "");
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      // polling first: reliable behind Render/Vercel proxies, upgrades to websocket
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    // ✅ When connected
    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);

      // Join user-specific room for targeted notifications
      if (user?._id) {
        newSocket.emit("joinRoom", user._id);
        console.log(`👤 Joined room for user: ${user._id}`);
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    });

    // ✅ Handle incoming notifications
    newSocket.on("newNotification", (notif) => {
      console.log("🔔 New notification received:", notif);
      setNotifications((prev) => [notif, ...prev]); // add to state
    });

    // ✅ Save the socket instance
    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup on unmount or when user changes
    return () => {
      console.log("🧹 Cleaning up socket connection...");
      newSocket.disconnect();
      if (socketRef.current === newSocket) socketRef.current = null;
      setSocket(null);
    };
  }, [user, token]);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

// Helpful hook for consumers
export const useSocket = () => {
  const ctx = React.useContext(SocketContext);
  return ctx ? ctx.socket : null;
};
