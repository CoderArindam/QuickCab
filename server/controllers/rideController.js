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

const createRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { pickup, destination, vehicleType } = req.body;
  //   console.log(pickup, destination, vehicleType);

  try {
    const ride = await createRideService({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    res.status(201).json(ride);

    const pickupCoordinates = await getAddressCoordinate(pickup);
    const captainsInRadius = await getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      10
    );

    console.log("found captains", captainsInRadius);
    ride.otp = "";

    const rideWithUser = await rideModel.findOne(ride._id).populate("user");
    captainsInRadius.map(async (captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
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

const startRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { rideId, otp } = req.body;
  try {
    const ride = await startRideService(rideId, otp);
    return res.status(200).json(ride);
  } catch (error) {
    console.log(error.message);
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
export { createRide, confirmRide, startRide, getCaptainLocation };
