import React from "react";
import axios from "axios";

const RazorpayPayment = ({
  rideId,
  amount,
  userName,
  userEmail,
  userContact,
  onPaymentSuccess,
}) => {
  const handlePayment = async () => {
    // Load Razorpay script
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const res = await loadRazorpayScript();

    if (!res) {
      alert("Failed to load Razorpay SDK. Check your internet connection.");
      return;
    }

    try {
      // Create order by sending rideId and amount to the backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/payment/order`,
        {
          rideId,
          amount,
        }
      );

      if (!data.success) {
        alert("Error creating order. Please try again.");
        return;
      }

      const { amount: orderAmount, currency, id: order_id } = data.order;

      // Configure Razorpay payment options
      const options = {
        key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`, // Razorpay Key ID
        amount: orderAmount.toString(),
        currency: currency,
        name: "QuickCab",
        description: `Payment for Ride ${rideId}`,
        order_id: order_id, // Razorpay order ID

        handler: async function (response) {
          const paymentDetails = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            rideId, // Pass rideId for reference
          };

          try {
            const result = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/api/payment/verify`,
              paymentDetails
            );

            if (result.data.success) {
              alert("Payment successful and verified!");
              // Only call onPaymentSuccess here after verification
              onPaymentSuccess(); // Trigger the redirect only after successful payment
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Error verifying payment. Please try again.");
          }
        },

        prefill: {
          name: userName, // Dynamic user name
          email: userEmail, // Dynamic user email
          contact: userContact, // Dynamic user phone number
        },
        notes: {
          address: "QuickCab Payment Gateway",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Open Razorpay payment interface
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment. Please try again.");
    } finally {
      onPaymentSuccess();
    }
  };

  return (
    <div>
      <button onClick={handlePayment} style={styles.button}>
        Make Payment
      </button>
    </div>
  );
};

const styles = {
  button: {
    backgroundColor: "#3399cc",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default RazorpayPayment;
