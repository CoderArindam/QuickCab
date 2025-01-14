import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();
const socket = io(`${import.meta.env.VITE_BASE_URL}`);

const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_BASE_URL}`);

    socket.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    // return () => {
    //   socket.current.disconnect();
    // };
  }, []);

  const sendMessage = (eventName, message) => {
    if (socket.current) {
      socket.current.emit(eventName, message);
    }
  };

  const receiveMessage = (eventName, callback) => {
    if (socket.current) {
      socket.current.on(eventName, callback);
    }
  };

  return (
    <SocketContext.Provider value={{ sendMessage, receiveMessage, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
