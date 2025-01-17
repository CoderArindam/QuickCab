import {
  createOrder,
  handleSuccessfulPayment,
} from "../services/paymentService.js";

export const createOrderController = async (req, res) => {
  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res
        .status(400)
        .json({ success: false, message: "Ride ID is required" });
    }

    const order = await createOrder(rideId);

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPaymentController = async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    if (!paymentId || !orderId || !signature) {
      return res
        .status(400)
        .json({ success: false, message: "All payment fields are required" });
    }

    const success = await handleSuccessfulPayment(
      orderId,
      paymentId,
      signature
    );

    res
      .status(200)
      .json({ success, message: "Payment successful and verified" });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
