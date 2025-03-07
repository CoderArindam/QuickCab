import userModel from "../models/userModel.js";
import { createUser } from "../services/userService.js";
import { validationResult } from "express-validator";
import blacklistedTokenModel from "../models/blacklistedTokenModel.js";
import { getFare } from "../services/rideService.js";
import rideModel from "../models/rideModel.js";

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;
  const { firstName, lastName } = fullName;
  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashPassword = await userModel.hashPassword(password);

  try {
    const user = await createUser(firstName, lastName, email, hashPassword);
    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: false, // More secure; prevents client-side JS access
      secure: isProduction ? true : false, // Ensures the browser only sends the cookie over HTTPS
      sameSite: isProduction ? "None" : "Lax", // Adjust based on cross-site requirements
    });
    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: false, // More secure; prevents client-side JS access
      secure: isProduction ? true : false, // Ensures the browser only sends the cookie over HTTPS
      sameSite: isProduction ? "None" : "Lax", // Adjust based on cross-site requirements
    });
    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res, next) => {
  return res.status(200).json(req.user);
};

const logoutUser = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  await blacklistedTokenModel.create({ token });
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

const calculateFareForUser = async (req, res) => {
  const { pickup, destination } = req.query;

  try {
    const fare = await getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkOngoingRide = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const ongoingRide = await rideModel
      .findOne({ userId, status: "ongoing" })
      .populate("captain")
      .populate("user");

    if (!ongoingRide) {
      return res.status(404).json({ message: "No ongoing ride found" });
    }

    return res.status(200).json(ongoingRide);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  calculateFareForUser,
  checkOngoingRide,
};
