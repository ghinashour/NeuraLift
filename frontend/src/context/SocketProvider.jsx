import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 🚫 If no user or token, disconnect socket if exists
    if (!user || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      console.log("❌ No user or token, socket not initialized");
      return;
    }

    console.log("🔗 Connecting socket for user:", user?._id);

    // ✅ Connect to backend with token authentication
    const newSocket = io("http://localhost:4000", {
      auth: { token },
      transports: ["websocket"],
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
    setSocket(newSocket);

    // Cleanup on unmount or when user changes
    return () => {
      console.log("🧹 Cleaning up socket connection...");
      newSocket.disconnect();
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
