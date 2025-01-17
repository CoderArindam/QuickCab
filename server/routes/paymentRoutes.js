import express from "express";
import {
  createOrderController,
  verifyPaymentController,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/order", createOrderController);
router.post("/verify", verifyPaymentController);

export default router;
