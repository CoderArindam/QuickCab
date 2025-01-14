import mongoose from "mongoose";
import rideModel from "../models/rideModel.js";
import { getDistanceTimeService } from "./mapsService.js";
import crypto from "crypto";
import { sendMessageToSocketId } from "../socket.js";

const getOTP = (num) => {
  const otp = crypto
    .randomInt(0, Math.pow(10, num))
    .toString()
    .padStart(num, "0");
  return otp;
};
const getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("pickup and destination required");
  }

  const distanceTime = await getDistanceTimeService(pickup, destination);

  if (distanceTime.status !== "OK") {
    throw new Error("Unable to calculate distance and time");
  }

  const distance = distanceTime.distance.value / 1000; // Convert meters to kilometers
  const time = distanceTime.duration.value / 60; // Convert seconds to minutes

  const baseFare = {
    auto: 30,
    car: 50,
    moto: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    moto: 7,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    moto: 1,
  };

  const fare = {
    auto: Math.round(
      baseFare.auto + distance * perKmRate.auto + time * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car + distance * perKmRate.car + time * perMinuteRate.car
    ),
    moto: Math.round(
      baseFare.moto + distance * perKmRate.moto + time * perMinuteRate.moto
    ),
  };

  return fare;
};

const createRideService = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);

  console.log("fare", fare);
  if (!fare[vehicleType]) {
    throw new Error("Invalid vehicle type");
  }

  try {
    const ride = await rideModel.create({
      user,
      pickup,
      destination,
      vehicleType,
      otp: getOTP(6),
      fare: fare[vehicleType],
    });
    console.log("Ride created successfully:", ride);
    return ride;
  } catch (error) {
    console.error("Error creating ride:", error);
    throw new Error("Failed to create ride");
  }
};

const confirmRideService = async ({ rideId, captainDetails }) => {
  try {
    console.log("rideId:", rideId, "captainDetails:", captainDetails);

    if (!rideId) {
      throw new Error("Ride ID not found");
    }

    // Find and update the ride, returning the updated document
    const updatedRide = await rideModel.findOneAndUpdate(
      { _id: rideId },
      {
        status: "accepted",
        captain: captainDetails._id,
      },
      { new: true }
    );

    if (!updatedRide) {
      console.error("Ride not found or failed to update");
      throw new Error("Ride not found or failed to update");
    }

    // Fetch the ride with populated user details
    const ride = await rideModel
      .findOne({ _id: rideId })
      .populate("user")
      .populate("captain");

    if (!ride) {
      console.error("No ride found after update with ID:", rideId);
      throw new Error("No ride found after update");
    }
    console.log("i am ride:", ride);
    return ride;
  } catch (error) {
    console.error("Error in confirmRideService:", error.message, error.stack);
    throw error;
  }
};

const startRideService = async (rideId, otp, captain) => {
  if (!rideId || !otp) {
    throw new Error("ride id and otp are required");
  }

  const ride = await rideModel
    .findOne({ _id: rideId })
    .populate("user")
    .populate("captain")
    .select("+otp");
  if (!ride) {
    throw new Error("no ride found");
  }

  if (ride.status !== "accepted") {
    throw new Error("ride not accepted!");
  }

  if (ride.otp !== otp) {
    throw new Error("invalid otp");
  }
  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  );

  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-started",
    data: ride,
  });
  return ride;
};

const getCaptainLocationService = async ({ rideId, userId, captainId }) => {
  // 1) Fetch the ride and populate 'captain' if stored in that field
  const ride = await rideModel.findById(rideId).populate("captain").exec();
  if (!ride) {
    throw new Error("Ride not found");
  }

  // 2) Ensure the ride belongs to this user
  if (ride.user.toString() !== userId.toString()) {
    throw new Error("You are not authorized to view this ride");
  }

  // 3) Ensure the ride has a captain and it matches the provided captainId
  if (!ride.captain || ride.captain._id.toString() !== captainId.toString()) {
    throw new Error("Captain not found for this ride");
  }

  // 4) Return captain's location
  return ride.captain.location; // e.g. { lat: 22.636..., lng: 88.421... }
};

export {
  createRideService,
  getFare,
  confirmRideService,
  startRideService,
  getCaptainLocationService,
};
