import express from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import {
  getAutoCompleteSuggestions,
  getCoordinates,
  getCurrentLocation,
  getDistanceTime,
} from "../controllers/mapController.js";
import { body, query } from "express-validator";
const router = express.Router();
router.post(
  "/get-coordinates",
  body("address").isString().isLength({ min: 3 }),
  authUser,
  getCoordinates
);
router.post(
  "/get-distance-time",
  body("origin").isString().isLength({ min: 3 }),
  body("destination").isString().isLength({ min: 3 }),
  //   authUser,
  getDistanceTime
);

router.get(
  "/get-suggestions",
  query("input").isString().isLength({ min: 3 }),
  authUser,
  getAutoCompleteSuggestions
);
router.get("/current-location", authUser, getCurrentLocation);
export default router;
