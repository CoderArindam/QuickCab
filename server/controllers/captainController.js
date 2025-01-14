import { validationResult } from "express-validator";
import { createCaptain } from "../services/captainService.js";
import captainModel from "../models/captainModel.js";
import blacklistedTokenModel from "../models/blacklistedTokenModel.js";

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
  res.cookie("token", token);
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  //   maxAge: 24 * 60 * 60 * 1000, // 1 day
  // });
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
export { registerCaptain, loginCaptain, getCaptainProfile, logoutCaptain };
