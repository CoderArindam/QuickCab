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

    socket.on("ride-cancelled", async (data) => {
      try {
        const { rideId, captainId, userSocketId } = data;

        const ride = await rideModel.findById(rideId);
        if (!ride) {
          return socket.emit("error", { message: "Ride not found" });
        }
        ride.status = "cancelled";

        await ride.save();

        const updatedCaptain = await captainModel.findOneAndUpdate(
          { _id: captainId },
          {
            status: "active",
          },
          { new: true }
        );

        // Notify the user that the ride has been cancelled
        if (userSocketId) {
          io.to(userSocketId).emit("ride-cancelled", {
            message: "Ride cancelled by captain",
          });
        }

        socket.emit("ride-cancelled-success", {
          message: "Ride cancelled successfully",
        });
      } catch (error) {
        socket.emit("error", { message: "Server error", error });
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
          // Step 1: Update the captain's location in the database
          await captainModel.findByIdAndUpdate(userId, {
            location: { lat: location.lat, lng: location.lng },
          });

          // Step 2: Check for an ongoing ride and emit the location to the user if applicable
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
