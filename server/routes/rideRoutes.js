import express from "express";
import { body, param } from "express-validator";
import {
  cancelRide,
  confirmRide,
  createRide,
  getCaptainLocation,
  startRide,
} from "../controllers/rideController.js";
import { authUser } from "../middlewares/authMiddleware.js";
import { authCaptain } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  authUser,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("invalid destination"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "moto"])
    .withMessage("invalid vehicle type"),
  createRide
);

router.post(
  "/confirm",
  // authCaptain,
  body("rideDetails._id").isMongoId().withMessage("invalid ride id"),
  confirmRide
);

router.post(
  "/start-ride",
  authCaptain,
  body("rideId").isMongoId().withMessage("invalid ride id"),
  body("otp").isLength({ min: 6 }).withMessage("invalid otp"),
  startRide
);
// Cancel ride
router.post(
  "/cancel-ride",
  authCaptain,
  body("rideId").isMongoId().withMessage("invalid ride id"),
  cancelRide
);
// GET captain location
router.get(
  "/:rideId/captain/:captainId/location",
  authUser,
  param("rideId").isMongoId().withMessage("Invalid ride ID"),
  param("captainId").isMongoId().withMessage("Invalid captain ID"),
  getCaptainLocation
);

export default router;
