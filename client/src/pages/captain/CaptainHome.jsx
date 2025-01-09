import React, { useEffect, useRef, useState } from "react";
import CaptainDetails from "../../components/captain/CaptainDetails";
import { Link } from "react-router-dom";
import RidePopup from "../../components/captain/RidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopup from "../../components/captain/ConfirmRidePopup";

const CaptainHome = () => {
  const [showRidePopupPanel, setShowRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);

  const [showConfirmRidePopupPanel, setShowConfirmRidePopupPanel] =
    useState(false);
  const confrimRidePopupPanelRef = useRef(null);

  useGSAP(() => {
    if (showRidePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [showRidePopupPanel]);

  useGSAP(() => {
    if (showConfirmRidePopupPanel) {
      gsap.to(confrimRidePopupPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confrimRidePopupPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [showConfirmRidePopupPanel]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRidePopupPanel(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>
      <div
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
        ref={ridePopupPanelRef}
      >
        <RidePopup
          setShowRidePopupPanel={setShowRidePopupPanel}
          setShowConfirmRidePopupPanel={setShowConfirmRidePopupPanel}
        />
      </div>
      <div
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
        ref={confrimRidePopupPanelRef}
      >
        <ConfirmRidePopup
          setShowConfirmRidePopupPanel={setShowConfirmRidePopupPanel}
          setShowRidePopupPanel={setShowRidePopupPanel}
        />
      </div>

      <div className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"></div>
      <div className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"></div>
    </div>
  );
};

export default CaptainHome;
