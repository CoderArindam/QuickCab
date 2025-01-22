import React from "react";
import { useNavigate } from "react-router-dom";

const FinishCaptainRide = ({ rideData }) => {
  console.log(rideData);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Ride Completed</h2>
        <p className="text-gray-700 mb-6 text-center">
          Thank you for riding with us! We hope you had a pleasant journey.
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
        <button
          className="px-6 py-2 mb-2 bg-green-500 text-white font-semibold rounded-full shadow-md w-full"
          onClick={() => navigate("/captain-home")}
        >
          Find Another Ride
        </button>
        <button
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md w-full"
          onClick={() => setShowFinishCaptainRidePanel(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FinishCaptainRide;
