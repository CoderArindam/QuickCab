import { validationResult } from "express-validator";
import { createCaptain } from "../services/captainService.js";
import captainModel from "../models/captainModel.js";
import blacklistedTokenModel from "../models/blacklistedTokenModel.js";
import rideModel from "../models/rideModel.js";

const registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, vehicle } = req.body;
  const { firstName, lastName } = fullName;
  const { color, plateNumber, capacity, vehicleType } = vehicle;

  const existingCaptain = await captainModel.findOne({ email });
  if (existingCaptain) {
    return res.status(400).json({ message: "Captain already exists" });
  }

  const hashPassword = await captainModel.hashPassword(password);

  try {
    const captain = await createCaptain(
      firstName,
      lastName,
      email,
      hashPassword,
      color,
      plateNumber,
      capacity,
      vehicleType
    );
    const token = captain.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return res.status(201).json({ token, captain });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = captain.generateAuthToken();
  // res.cookie("token", token);
  res.cookie("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  return res.status(200).json({ token, captain });
};

const getCaptainProfile = async (req, res, next) => {
  return res.status(200).json(req.captain);
};

const logoutCaptain = async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  await blacklistedTokenModel.create({ token });
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

const checkCaptainStatus = async (req, res) => {
  try {
    const { captainId } = req.query;

    // Check captain's status
    const captain = await captainModel.findById(captainId);
    if (!captain || captain.status !== "riding") {
      return res
        .status(404)
        .json({ message: "No ongoing ride for this captain." });
    }

    // Find ongoing ride for this captain
    const ride = await rideModel
      .findOne({ captain: captainId, status: "ongoing" })
      .populate("user")
      .populate("captain");

    if (!ride) {
      return res.status(404).json({ message: "No ongoing ride found." });
    }

    return res.status(200).json({ ride });
  } catch (error) {
    console.error("Error checking ongoing ride:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
export {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
  checkCaptainStatus,
};
