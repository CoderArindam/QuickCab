import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FinishCaptainRide from "../../components/captain/FinishCaptainRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CaptainRiding = () => {
  const navigate = useNavigate();
  const [showFinishCaptainRidePanel, setShowFinishCaptainRidePanel] =
    useState(false);
  const finishCaptainRidePanelRef = useRef(null);

  useGSAP(() => {
    if (showFinishCaptainRidePanel) {
      gsap.to(finishCaptainRidePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else {
      gsap.to(finishCaptainRidePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [showFinishCaptainRidePanel]);
  return (
    <div className="h-screen flex flex-col">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen bg-white shadow-md z-10">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber Logo"
        />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="flex-grow relative">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Riding"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-yellow-400 flex flex-col justify-center items-center">
          <h4 className="text-xl font-semibold mb-4">5 kms away</h4>
          <button
            className="px-6 py-2 mb-2 bg-green-500 text-white font-semibold rounded-full shadow-md"
            onClick={() => nav}
          >
            Finish Ride
          </button>
          <button className="px-6 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md">
            Cancel Ride
          </button>
        </div>
      </div>
      <div
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
        ref={finishCaptainRidePanelRef}
      >
        <FinishCaptainRide
          setShowFinishCaptainRidePanel={setShowFinishCaptainRidePanel}
        />
      </div>
    </div>
  );
};

export default CaptainRiding;
