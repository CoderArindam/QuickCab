import express from "express";
import { body } from "express-validator";
import { createRide } from "../controllers/rideController.js";
import { authUser } from "../middlewares/authMiddleware.js";

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

export default router;
