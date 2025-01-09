import React from "react";

const FinishCaptainRide = ({ setShowFinishCaptainRidePanel }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Ride Completed</h2>
        <p className="text-gray-700 mb-6 text-center">
          Thank you for riding with us! We hope you had a pleasant journey.
        </p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
          onClick={() => setShowFinishCaptainRidePanel(false)}
        >
          Find Another Ride
        </button>
      </div>
    </div>
  );
};

export default FinishCaptainRide;
