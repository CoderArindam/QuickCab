import express from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import { getCoordinates } from "../controllers/mapController.js";
import { body } from "express-validator";
const router = express.Router();
router.post(
  "/get-coordinates",
  body("address").isString().isLength({ min: 3 }),
  authUser,
  getCoordinates
);

export default router;
