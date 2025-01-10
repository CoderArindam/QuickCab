import rideModel from "../models/rideModel.js";
import { getDistanceTimeService } from "./mapsService.js";
import crypto from "crypto";

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

export { createRideService, getFare };
