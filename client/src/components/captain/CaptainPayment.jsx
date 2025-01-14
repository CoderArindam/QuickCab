import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CaptainPaymentPage = ({ rideData }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success");
      navigate("/captain-ride-finished");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Receive Payment</h2>
        <p className="text-gray-700 mb-6 text-center">
          Please confirm the payment details below.
        </p>
        <div className="mb-6">
          <p className="text-gray-700">
            <strong>Distance Traveled:</strong> {rideData?.distance} kms
          </p>
          <p className="text-gray-700">
            <strong>Fare:</strong> ${rideData?.fare}
          </p>
          <p className="text-gray-700">
            <strong>Duration:</strong> {rideData?.duration} minutes
          </p>
        </div>
        {paymentStatus === "success" ? (
          <p className="text-green-500 text-center mb-4">Payment Successful!</p>
        ) : (
          <button
            className="px-6 py-2 mb-2 bg-green-500 text-white font-semibold rounded-full shadow-md w-full"
            onClick={handlePayment}
          >
            Confirm Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default CaptainPaymentPage;
