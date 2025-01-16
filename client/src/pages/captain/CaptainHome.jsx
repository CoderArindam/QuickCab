import React, { useContext, useEffect, useRef, useState } from "react";
import CaptainDetails from "../../components/captain/CaptainDetails";
import { Link } from "react-router-dom";
import RidePopup from "../../components/captain/RidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopup from "../../components/captain/ConfirmRidePopup";
import { CaptainDataContext } from "../../context/CaptainContext";
import { SocketContext } from "../../context/SocketContext";
import axios from "axios";
import LiveTracking from "../../components/tracking/LiveTracking";
const CaptainHome = () => {
  const [showRidePopupPanel, setShowRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);
  const { captain } = useContext(CaptainDataContext);
  const { sendMessage, receiveMessage, socket } = useContext(SocketContext);

  const [showConfirmRidePopupPanel, setShowConfirmRidePopupPanel] =
    useState(false);
  const confrimRidePopupPanelRef = useRef(null);
  const [rideDetails, setRideDetails] = useState({});
  useEffect(() => {
    // Join the socket room
    sendMessage("join", {
      userType: "captain",
      userId: captain._id,
    });

    // Function to fetch the captain's current location
    const fetchLocationAndSend = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            sendMessage("update-captain-location", {
              userId: captain._id,
              location: { lat: latitude, lng: longitude },
            });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    // Interval to send location updates every 10 seconds
    const intervalId = setInterval(fetchLocationAndSend, 10000);
    fetchLocationAndSend();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  receiveMessage("new-ride", (data) => {
    setRideDetails(data);

    setShowRidePopupPanel(true);
  });

  const confirmRide = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/rides/confirm`,
        {
          rideDetails,
          captainDetails: captain,
        },
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };
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

  return (
    <div className="h-[90vh]">
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
        <LiveTracking captainDetails={captain} rideDetails={rideDetails} />
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails captain={captain} />
      </div>
      {rideDetails && (
        <div
          className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
          ref={ridePopupPanelRef}
        >
          <RidePopup
            setShowRidePopupPanel={setShowRidePopupPanel}
            setShowConfirmRidePopupPanel={setShowConfirmRidePopupPanel}
            rideDetails={rideDetails}
            setRideDetails={setRideDetails}
            confirmRide={confirmRide}
          />
        </div>
      )}

      <div
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
        ref={confrimRidePopupPanelRef}
      >
        <ConfirmRidePopup
          setShowConfirmRidePopupPanel={setShowConfirmRidePopupPanel}
          setShowRidePopupPanel={setShowRidePopupPanel}
          rideDetails={rideDetails}
        />
      </div>

      <div className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"></div>
      <div className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"></div>
    </div>
  );
};

export default CaptainHome;
