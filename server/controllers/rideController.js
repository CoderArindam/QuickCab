import {
  getAddressCoordinate,
  getCaptainsInTheRadius,
} from "../services/mapsService.js";
import {
  confirmRideService,
  createRideService,
  getCaptainLocationService,
  startRideService,
} from "../services/rideService.js";
import { validationResult } from "express-validator";
import { sendMessageToSocketId } from "../socket.js";
import rideModel from "../models/rideModel.js";
import captainModel from "../models/captainModel.js";

const createRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    // Step 1: Create the ride
    const ride = await createRideService({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    res.status(201).json(ride);

    // Step 2: Get pickup coordinates
    const pickupCoordinates = await getAddressCoordinate(pickup);

    // Step 3: Find captains in the radius
    const captainsInRadius = await getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      30
    );

    console.log("Captains in the radius:", captainsInRadius);

    // Step 4: Filter active captains
    const activeCaptains = captainsInRadius.filter(
      (captain) => captain.status === "active"
    );

    console.log("Active captains:", activeCaptains);

    // Step 5: Populate ride with user details
    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");

    // Step 6: Notify active captains about the new ride
    activeCaptains.forEach((captain) => {
      if (!captain.socketId) {
        console.warn(`Captain ${captain._id} has no socketId.`);
      } else {
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: rideWithUser,
        });
      }
    });
  } catch (error) {
    console.error("Error in createRide:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const confirmRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { rideDetails, captainDetails } = req.body;
  console.log("rideDetails from ride controller", rideDetails);
  console.log("captainDetails from ride controller", captainDetails);

  const rideId = rideDetails._id;

  try {
    const confirmedRide = await confirmRideService({ rideId, captainDetails });

    sendMessageToSocketId(rideDetails.user.socketId, {
      event: "ride-confirmed",
      data: confirmedRide,
    });

    return res.status(200).json(confirmedRide);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const cancelRide = async (req, res) => {
  try {
    const { rideId, captainId } = req.body;

    const ride = await rideModel.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
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
    res.status(200).json({ message: "Ride cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const startRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { rideId, otp } = req.body;
  try {
    const ride = await startRideService(rideId, otp);
    console.log(ride);
    return res.status(200).json(ride);
  } catch (error) {
    console.log(error.message);
  }
};

const checkRideStatus = async (req, res) => {
  const { rideId } = req.body;

  if (!rideId) {
    return res.status(400).json({ message: "Ride ID not found" });
  }

  try {
    const ride = await rideModel.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const isCancelled = ride.status === "cancelled";
    return res.status(200).json({ ride, isCancelled });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
const getCaptainLocation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, captainId } = req.params;
  const userId = req.user._id; // Assuming `req.user` is set by authUser middleware

  try {
    const location = await getCaptainLocationService({
      rideId,
      userId,
      captainId,
    });
    return res.status(200).json({ location });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export {
  createRide,
  confirmRide,
  startRide,
  getCaptainLocation,
  cancelRide,
  checkRideStatus,
};
