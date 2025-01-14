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

    socket.on("update-captain-location", async (data) => {
      try {
        const { userId, location } = data;
        if (!location || !location.lat || !location.lng) {
          return socket.emit("error", { message: "invalid location data" });
        }
        const result = await captainModel.findOneAndUpdate(
          { _id: userId },
          {
            location: {
              lat: location.lat,
              lng: location.lng,
            },
          }
        );
        console.log(result);
      } catch (error) {
        console.log(error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`a user disconnected with ${socket.id}`);
    });
  });
};

export const sendMessageToSocketId = (socketId, messageObject) => {
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.error("Socket.io is not initialized");
  }
};
