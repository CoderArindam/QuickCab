import {
  getAddressCoordinate,
  getAutoCompleteSuggestionsService,
  getCurrentLocationService,
  getDistanceTimeService,
} from "../services/mapsService.js";
import { validationResult } from "express-validator";

const getCoordinates = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { address } = req.body;

  try {
    const coordinates = await getAddressCoordinate(address);
    res.status(200).json(coordinates);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const getDistanceTime = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination } = req.body;
    const distanceTime = await getDistanceTimeService(origin, destination);
    res.status(200).json(distanceTime);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const getAutoCompleteSuggestions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { input } = req.query;
    const suggestions = await getAutoCompleteSuggestionsService(input);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const getCurrentLocation = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const location = await getCurrentLocationService(lat, lng);
    res.status(200).json({ location });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
  getCurrentLocation,
};
