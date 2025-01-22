import React, { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FinishCaptainRide from "../../components/captain/FinishCaptainRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  MapPin,
  Navigation,
  Clock,
  User,
  Phone,
  X,
  AlertCircle,
} from "lucide-react";

const CaptainRiding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rideData = location.state?.rideData;
  const [showFinishCaptainRidePanel, setShowFinishCaptainRidePanel] =
    useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const finishCaptainRidePanelRef = useRef(null);

  useGSAP(() => {
    if (showFinishCaptainRidePanel) {
      gsap.to(finishCaptainRidePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(finishCaptainRidePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [showFinishCaptainRidePanel]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="fixed p-4 top-0 flex items-center justify-between w-full bg-white shadow-md z-10">
        <div className="flex items-center space-x-4">
          <img
            className="w-12 h-12 object-contain"
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="Uber Logo"
          />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Current Ride</span>
            <span className="font-semibold">#{rideData?._id || "12345"}</span>
          </div>
        </div>
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-grow relative mt-16">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
            alt="Riding Map"
          />
        </div>

        {/* Passenger Info Card */}
        <div className="absolute top-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={
                    rideData?.passengerImage || "https://via.placeholder.com/48"
                  }
                  alt="Passenger"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">
                  <span>
                    {rideData?.user?.fullName?.firstName} {""}
                    {rideData?.user?.fullName?.lastName}
                  </span>
                </h3>
                <span className="text-sm text-gray-500">Passenger</span>
              </div>
            </div>
            <a
              href={`tel:${rideData?.passengerPhone || "+1234567890"}`}
              className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-500">Pickup Location</span>
                <p className="font-medium">
                  {rideData?.pickup || "123 Main St"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-500">Drop-off Location</span>
                <p className="font-medium">
                  {rideData?.destination || "456 Oak Ave"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-3xl overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Estimated Time:</span>
              </div>
              <span className="text-lg font-bold">15 mins</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Distance Remaining:</span>
              </div>
              <span className="text-lg font-bold">5 km</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() =>
                  navigate("/captain-payment", { state: { rideData } })
                }
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Complete Ride</span>
              </button>

              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-6 py-3 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Cancel Ride</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cancel Ride?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this ride? This action cannot be
                undone.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    navigate("/captain-home");
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Cancel Ride
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finish Ride Panel */}
      <div
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-lg"
        ref={finishCaptainRidePanelRef}
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
        <FinishCaptainRide
          rideData={rideData}
          setShowFinishCaptainRidePanel={setShowFinishCaptainRidePanel}
        />
      </div>
    </div>
  );
};

export default CaptainRiding;
