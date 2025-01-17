import Razorpay from "razorpay";
import crypto from "crypto";
import rideModel from "../models/rideModel.js";
import captainModel from "../models/captainModel.js";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// Create an order
export const createOrder = async (rideId) => {
  const ride = await rideModel
    .findById(rideId)
    .populate("captain")
    .populate("user");

  if (!ride) throw new Error("Ride not found");

  if (ride.status === "completed") {
    throw new Error("Ride has already been completed");
  }

  const options = {
    amount: ride.fare * 100, // Convert fare to paise
    currency: "INR",
    receipt: `receipt_${rideId}`,
    payment_capture: 1,
  };

  const order = await razorpay.orders.create(options);

  // Save orderId to ride model
  ride.orderId = order.id;
  await ride.save();

  return order;
};

// Verify payment
export const verifyPayment = (paymentId, orderId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
};
// Handle successful payment
export const handleSuccessfulPayment = async (
  orderId,
  paymentId,
  signature
) => {
  // Retrieve the ride by orderId, not paymentId
  const ride = await rideModel
    .findOne({ orderId }) // Use orderId to search
    .populate("captain user");

  if (!ride) throw new Error("Ride not found");

  if (ride.status === "completed") {
    throw new Error("Ride payment has already been processed");
  }

  // Verify the payment
  const isVerified = verifyPayment(paymentId, orderId, signature);

  if (!isVerified) throw new Error("Payment verification failed");

  // Update ride and captain
  ride.status = "completed";
  ride.paymentId = paymentId; // Save paymentId when payment is successful
  ride.signature = signature;
  await ride.save();

  if (ride.captain) {
    await captainModel.findByIdAndUpdate(ride.captain, {
      status: "active",
    });
  }

  // Trigger socket events (if required)
  // const io = global.io; // Assume socket instance is globally available
  // if (io) {
  //   io.to(ride._id.toString()).emit("paymentSuccess", {
  //     rideId: ride._id,
  //     userId: ride.user._id,
  //     captainId: ride.captain._id,
  //   });
  // }

  return true;
};
