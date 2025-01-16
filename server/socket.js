import { Server } from "socket.io";
import userModel from "./models/userModel.js";
import captainModel from "./models/captainModel.js";
import rideModel from "./models/rideModel.js";

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

    socket.on("update-user-location", async (data) => {
      console.log("data from update-user-location", data);
      try {
        const { userId, location } = data;
        if (location?.lat && location?.lng) {
          // Find the most recent ongoing ride for the user
          const ride = await rideModel
            .findOne({ user: userId, status: "ongoing" })
            .sort({ updatedAt: -1 }) // Sort by the most recently updated ride
            .populate("captain");

          if (ride?.captain?.socketId) {
            console.log(
              "Emitting user location to captain:",
              ride.captain.socketId,
              location
            );
            io.to(ride.captain.socketId).emit("update-user-location", {
              location,
            });
          } else {
            console.log("No ongoing ride or captain found for the user.");
          }
        } else {
          console.error("Invalid location data:", data);
        }
      } catch (error) {
        console.error("Error updating user location:", error);
      }
    });

    socket.on("update-captain-location", async (data) => {
      try {
        const { userId, location } = data;
        if (location?.lat && location?.lng) {
          // Find the most recent ongoing ride for the captain
          const ride = await rideModel
            .findOne({ captain: userId, status: "ongoing" })

            .populate("user");

          if (ride?.user?.socketId) {
            console.log(
              "Emitting captain location to user:",
              ride.user.socketId,
              location
            );
            io.to(ride.user.socketId).emit("update-captain-location", {
              location,
            });
          } else {
            console.log("No ongoing ride or user found for the captain.");
          }
        } else {
          console.error("Invalid location data:", data);
        }
      } catch (error) {
        console.error("Error updating captain location:", error);
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
