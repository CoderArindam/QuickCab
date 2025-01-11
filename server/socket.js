import { Server } from "socket.io";
import userModel from "./models/userModel.js";
import captainModel from "./models/captainModel.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`a user connected with ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;
      try {
        if (userType === "user") {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
          await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        }
        console.log(
          `Socket ID ${socket.id} stored for ${userType} with ID ${userId}`
        );
      } catch (error) {
        console.error("Error updating socket ID:", error);
      }
    });
    socket.on("disconnect", () => {
      console.log(`a user disconnected with ${socket.id}`);
    });
  });
};

export const sendMessageToSocketId = (socketId, message) => {
  if (io) {
    io.to(socketId).emit("message", message);
  } else {
    console.error("Socket.io is not initialized");
  }
};
