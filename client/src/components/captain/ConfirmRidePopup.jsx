import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmRidePopup = ({
  setShowConfirmRidePopupPanel,
  setShowRidePopupPanel,
  rideDetails,
  handleCancelRide,
}) => {
  console.log(rideDetails);
  const { pickup, destination, fare, user } = rideDetails || {};
  const { fullName } = user || {};
  const [otp, setOtp] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/rides/start-ride`,
      { otp, rideId: rideDetails._id },
      {
        withCredentials: true,
      }
    );
    console.log(response);
    if (response.status === 200) {
      navigate("/captain-riding", { state: { rideData: rideDetails } });
    } else {
      throw new Error("invalid otp");
    }
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => setShowConfirmRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">
        Confirm this ride to Start
      </h3>
      <div className="flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-12 rounded-full object-cover w-12"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt=""
          />
          <h2 className="text-lg font-medium capitalize">
            {fullName?.firstName}
            <span> {fullName?.lastName}</span>
          </h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <p className="text-sm -mt-1 text-gray-600">{pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <p className="text-sm -mt-1 text-gray-600">{destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash </p>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="number"
              className="bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg"
              type="submit"
            >
              Start Ride
            </button>
            <button
              className="w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg"
              onClick={(e) => {
                setShowConfirmRidePopupPanel(false);
                setShowRidePopupPanel(false);
                e.preventDefault();
                handleCancelRide();
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopup;
